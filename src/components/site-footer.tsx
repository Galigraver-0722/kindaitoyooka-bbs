export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl">
          A community-run student project. Not an official communication channel of Kindai
          University Toyooka Junior &amp; Senior High School.
        </p>
        <p>
          Built with{" "}
          <a
            href="https://nextjs.org"
            className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
          >
            Next.js
          </a>{" "}
          and{" "}
          <a
            href="https://www.prisma.io"
            className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
          >
            Prisma
          </a>
          . Licensed under MIT.
        </p>
      </div>
    </footer>
  );
}
