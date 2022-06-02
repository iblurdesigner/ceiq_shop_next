import { Step, StepLabel, Stepper } from '@mui/material';
import React from 'react';

// habia que renombrar el archivo con letra mayuscula al inicio
export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {[
        'Inicio Sesión',
        'Dirección de envío',
        'Método de Pago',
        'Realizar Pedido',
      ].map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
