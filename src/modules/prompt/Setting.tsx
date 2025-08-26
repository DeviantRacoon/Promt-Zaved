import Section from "../../common/components/Section";
import Layout from "./_layout";

import { route } from 'preact-router';
import { useEffect } from 'preact/hooks';
import { useAuth } from '../auth/useLogin';
import { useAuthState } from "../../hooks/useAuthState";

export default function Setting({ path }: { path: string }) {
  const { user, loading: authLoading } = useAuthState();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    route('/');
  };

  useEffect(() => {
    if (!authLoading && !user) route('/');
  }, [authLoading, user]);
  if (authLoading) {
    return (
      <Section className="card-body" path={path} aria-busy="true">
        <div className="d-flex justify-content-center align-items-center h-100">
          <span>Cargando...</span>
        </div>
      </Section>
    );
  }

  if (!user) return null;

  return (
    <Section className="card-body" path={path} aria-labelledby="create-prompt-title">
      <Layout>
        <div>
          <h2>Configuraciones</h2>
          <p className="mt-3">Sesión iniciada como: {user?.displayName}</p>
          <button className="btn btn-outline-danger mt-3" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </Layout>
    </Section>
  );
}
