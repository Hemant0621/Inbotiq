export default function Home() {
  return (
    <section className="space-y-8 rounded-xl bg-white p-10 shadow-sm">
      <h1 className="text-3xl font-semibold text-gray-900">
        Role-based Authentication Demo
      </h1>
      <p className="max-w-2xl text-gray-600">
        Explore the experience of signing up, logging in, and navigating a
        protected dashboard. Choose between admin and user roles to see how the
        application adapts.
      </p>
      <div className="flex flex-wrap gap-4">
        <a
          href="/signup"
          className="rounded-lg bg-gray-900 px-4 py-2 text-white transition hover:bg-gray-700"
        >
          Create an account
        </a>
        <a
          href="/login"
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100"
        >
          I already have an account
        </a>
      </div>
    </section>
  );
}
