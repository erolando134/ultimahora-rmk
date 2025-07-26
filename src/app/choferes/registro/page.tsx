import { Suspense } from "react";
import RegistrationForm from "./RegistrationForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RegistrationForm />
    </Suspense>
  );
}
