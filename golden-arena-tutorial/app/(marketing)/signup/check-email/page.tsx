// app/(marketing)/signup/check-email/page.tsx
export default function CheckEmailPage() {
  return (
    <div className="max-w-sm mx-auto p-6 space-y-4 text-center">
      <h1 className="text-lg font-semibold text-gray-900">Check your email</h1>
      <p className="text-sm text-gray-500">
        We&apos;ve sent a confirmation link to your email address. Click it to
        activate your account, then come back and log in.
      </p>
      <a
        href="/login"
        className="inline-block text-sm text-orange-700 font-medium"
      >
        Back to Log In
      </a>
    </div>
  );
}