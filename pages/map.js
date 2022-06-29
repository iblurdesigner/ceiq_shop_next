import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Store } from "../utils/Store";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { getError } from "../utils/error";
import { CircularProgress } from "@mui/material";

// const defaultLocation = { lat: 45.516, lng: -73.56 };
const defaultLocation = { lat: -0.21585056975750638, lng: -78.50850094534053 };
const libs = ["places"];

function Map() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const [googleApiKey, setGoogleApiKey] = useState("");

  useEffect(() => {
    const fetchGoogleApiKey = async () => {
      try {
        const { data } = await axios("/api/keys/google", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setGoogleApiKey(data);
        getUserCurrentLocation();
      } catch (err) {
        enqueueSnackbar(getError(err), { variant: "error" });
      }
    };
    fetchGoogleApiKey();
  }, []);

  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      enqueueSnackbar(
        "La Geolocalización no está soportada en este navegador",
        {
          variant: "error",
        }
      );
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };
  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };

  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };
  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({ lat: place.lat(), lng: place.lng() });
    setLocation({ lat: place.lat(), lng: place.lng() });
  };
  const onConfirm = () => {
    const places = placeRef.current.getPlaces();
    if (places && places.length === 1) {
      dispatch({
        type: "SAVE_SHIPPING_ADDRESS_MAP_LOCATION",
        payload: {
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        },
      });
      enqueueSnackbar("Ubicación seleccionada con éxito", {
        variant: "success",
      });
      router.push("/shipping");
    }
  };
  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };
  return googleApiKey ? (
    <>
      <div className="containerMap">
        <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
          <GoogleMap
            id="sample-map"
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={center}
            zoom={15}
            onLoad={onLoad}
            onIdle={onIdle}
          >
            <StandaloneSearchBox
              onLoad={onLoadPlaces}
              onPlacesChanged={onPlacesChanged}
            >
              <div className="w-80 h-30 bg-blue rounded-lg p-4 inputMap">
                <input
                  type="text"
                  data-test="addr-button"
                  placeholder="Ingrese su dirección"
                  className="p-2 mr-2"
                ></input>
                <button
                  data-test="confirm-map-button"
                  type="button"
                  className="bg-green rounded-full px-3 py-1 shadow-xl hover:bg-yellow"
                  onClick={onConfirm}
                >
                  Confirmar
                </button>
              </div>
            </StandaloneSearchBox>
            <Marker position={location} onLoad={onMarkerLoad}></Marker>
          </GoogleMap>
        </LoadScript>
      </div>

      {/* clases con JSX */}
      <style jsx>
        {`
          .containerMap {
            height: 100vh;
          }

          .inputMap {
            position: absolute;
            display: flex;
            left: 0;
            right: 0;
            margin: 10px auto;
            width: 300;
            height: 40;
          }
        `}
      </style>
    </>
  ) : (
    <CircularProgress />
  );
}

export default dynamic(() => Promise.resolve(Map), { ssr: false });
