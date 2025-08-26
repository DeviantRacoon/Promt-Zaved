import Section from "../../common/components/Section";
import Layout from "./_layout";
import { auth } from "../../lib/firebase";

import { route } from 'preact-router';
import { useAuth } from '../auth/useLogin';

export default function Setting({ path }: { path: string }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    route('/');
  };

  return (
    <Section className="card-body" path={path} aria-labelledby="create-prompt-title">
      <Layout>
        <div>
          <h2>Configuraciones</h2>
          <p className="mt-3">Sesión iniciada como: {auth.currentUser?.displayName}</p>
          <button className="btn btn-outline-danger mt-3" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </Layout>
    </Section>
  );
}
