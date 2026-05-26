import { Outlet } from "react-router-dom";

import { MainLayout } from "../layouts/MainLayout";
import { PageTransition } from "../components/PageTransition";

export function App() {
  return (
    <MainLayout>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </MainLayout>
  );
}
