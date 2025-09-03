import { SigninForm } from "@/components/auth/signin-form"

export default function SigninPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <SigninForm />
      </div>
    </div>
  )
}
