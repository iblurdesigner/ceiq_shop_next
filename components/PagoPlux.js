import React, { useState } from "react";
import { Modal } from "@mui/material";
import { Helmet } from "react-helmet";

export default function PagoPlux({ className, data }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Helmet>
        <script src="https://sandbox-paybox.pagoplux.com/js/addons/jquery-3.4.1.min.js"></script>
        <script src="https://sandbox-paybox.pagoplux.com/paybox/index.js"></script>

        <script type="text/javascript" src="../../utils/dataPagoPlux" />
        <script type="text/javascript" src="../../utils/onAuthoPagoPlux" />
      </Helmet>
      <button
        type="button"
        // onClick={onAuthorize}
        onClick={handleOpen}
        id="idElementoTest"
        className={`dark:text-black text-white bg-emerald-400 rounded-full px-3 py-1 shadow-xl hover:bg-yellow ${className}`}
      >
        PagoPlux
      </button>
      <div id="ButtonPaybox"></div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          id="paybox_modal"
          className="paybox_modal paybox_modal__bg"
          role="dialog"
          aria-hidden="true"
        >
          <div className="paybox_modal__dialog">
            <div id="paybox_modal_content" className="paybox_modal__content">
              <iframe
                id="iframePaybox"
                src="https://sandbox-paybox.pagoplux.com/paybox.html?1658807373997"
                frameBorder="0"
                className="w-80 h-96 bg-slate-500"
              ></iframe>
              <a href="" className="paybox_modal__close demo-close">
                <svg className="h-10 w-10 md:h-5 md:w-5 " viewBox="0 0 24 24">
                  <path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z"></path>
                  <path d="M0 0h24v24h-24z" fill="none"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
