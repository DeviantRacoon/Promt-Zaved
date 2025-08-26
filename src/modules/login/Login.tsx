import type { FunctionalComponent } from "preact";
import { auth } from "../../lib/firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { firefoxGoogleOIDC } from "../../lib/ffx-identity";

const Login: FunctionalComponent = () => {
  const signInWithGoogle = async () => {
    try {
      const { idToken } = await firefoxGoogleOIDC();
      const cred = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, cred);
      // TODO: route('/dashboard');
    } catch (e) {
      console.error("Google Sign-In failed", e);
      // TODO: mostrar alerta Bootstrap
    }
  };

  return (
    <button class="btn btn-primary w-100" onClick={signInWithGoogle}>
      Continuar con Google
    </button>
  );
};

export default Login;
