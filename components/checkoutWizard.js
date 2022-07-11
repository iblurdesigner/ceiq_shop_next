import { Step, StepLabel, Stepper } from "@mui/material";
import React from "react";

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {[
        "Inicio Sesión",
        "Dirección de envío",
        "Método de Pago",
        "Realizar Pedido",
      ].map((step) => (
        <Step key={step}>
          <StepLabel>
            <p className="dark:text-white">{step}</p>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
