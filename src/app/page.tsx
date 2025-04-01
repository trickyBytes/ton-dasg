import SignInForm from "@/components/SignInForm";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <SignInForm />
      <GoogleSignInButton />
    </main>
  )
}
