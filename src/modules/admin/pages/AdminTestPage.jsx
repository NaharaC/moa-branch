import React from "react";

const localAdminTestModule = import.meta.glob("./AdminTestPage.local.jsx", {
  eager: true,
});

const LocalAdminTestPage =
  localAdminTestModule["./AdminTestPage.local.jsx"]?.AdminTestPage ??
  localAdminTestModule["./AdminTestPage.local.jsx"]?.default;

export default function AdminTestPage() {
  if (LocalAdminTestPage) {
    return <LocalAdminTestPage />;
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4 p-10 text-center">
      <h1 className="text-2xl font-semibold text-primary">Admin Test (solo local)</h1>
      <p className="text-sm text-neutral-500">
        Esta pantalla existe solo como herramienta local. Podés crear{" "}
        <code>AdminTestPage.local.jsx</code> en este directorio para trabajarla sin subirla al repo.
      </p>
    </section>
  );
}
