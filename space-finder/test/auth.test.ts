import { AuthService } from "./auth.service";

async function testAuth() {
  const authService = new AuthService();
  const signInOutput = await authService.login("jean", "Clipar567.");
  const idToken = await authService.getIdToken();
}

testAuth();
