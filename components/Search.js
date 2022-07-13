import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { InputBase } from "@mui/material";

function Search() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const queryChangeHandler = useCallback(
    (e) => {
      setQuery(e.target.value);
    },
    [setQuery]
  );

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <div className="md:w-3/6 lg:w-4/6 order-1">
      <form
        onSubmit={submitHandler}
        className="flex items-center justify-between"
      >
        <InputBase
          className="bg-white rounded-l-lg p-4 h-6 m-0 text-gray-300 hover:text-cyan w-full"
          name="query"
          placeholder="Buscar productos"
          onChange={queryChangeHandler}
        />
        <button
          className="bg-cyan px-2 py-2 rounded-r-lg"
          type="submit"
          alt="boton buscador"
          aria-describedby="boton-buscador"
          aria-label="search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-5 text-white "
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  return prevProps.product === nextProps.product;
}

export default React.memo(Search, areEqual);
