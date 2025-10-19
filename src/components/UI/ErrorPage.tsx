import newGithubIssueUrl from "@core/utils/github.ts";
import { ExternalLink } from "lucide-react";
import { Heading } from "@components/UI/Typography/Heading.tsx";
import { Link } from "@components/UI/Typography/Link.tsx";
import { P } from "@components/UI/Typography/P.tsx";


export function ErrorPage({ error }: { error: Error }) {
  if (!error) {
    return null;
  }

  return (
    <article className="w-full h-screen overflow-y-auto dark:bg-background-primary dark:text-text-primary">
      <section className="flex shrink md:flex-row gap-16 mt-20 px-4 md:px-8 text-lg md:text-xl space-y-2 place-items-center dark:bg-background-primary text-slate-900 dark:text-text-primary">
        <div>
          <Heading as="h2" className="text-text-primary">
            Ini agak memalukan...
          </Heading>
          <P>
            Maaf, telah terjadi kesalahan pada klien web yang menyebabkan aplikasi berhenti berjalan. <br />
            Seharusnya hal ini tidak terjadi, dan kami sedang berupaya keras memperbaikinya.
          </P>
          <P>
            Cara terbaik agar hal ini tidak kembali terjadi pada Anda atau orang lain adalah dengan melaporkannya kepada kami.
          </P>
          <P>Sertakan informasi berikut dalam laporan Anda:</P>
          <ul className="list-disc list-inside text-sm">
            <li>Apa yang Anda lakukan saat kesalahan terjadi</li>
            <li>Hal yang Anda harapkan terjadi</li>
            <li>Hal yang benar-benar terjadi</li>
            <li>Informasi relevan lainnya</li>
          </ul>
          <P>
            Anda dapat melaporkan masalah ini melalui{" "}
            <Link
              href={newGithubIssueUrl({
                repoUrl: "https://github.com/meshtastic/web",
                template: "bug.yml",
                title: "[Bug]: An unhandled error occurred. <Add details here>",
                logs: error?.stack,
              })}
            >
              Github
            </Link>
            <ExternalLink size={24} className="inline-block ml-2" />
          </P>
          <P>
            Kembali ke <Link href="/">dasbor</Link>
          </P>
        </div>

        <div className="hidden md:block md:max-w-64 lg:max-w-80 w-full aspect-suqare">
          <img
            src="/images/chirpy.svg"
            alt="Chirpy the Meshtastic error"
            className="max-w-full h-auto"
          />
        </div>
      </section>
      <details className="mt-8 px-4 md:px-8 text-lg md:text-xl space-y-2 text-md whitespace-pre-wrap break-all">
        <summary className="cursor-pointer">Detail Kesalahan</summary>
        <span className="text-sm mt-4">
          {error?.message && (
            <>
              <label htmlFor="message">Pesan kesalahan:</label>
              <p
                id="message"
                className="text-slate-400 break-words overflow-wrap"
              >
                {error.message}
              </p>
            </>
          )}
          {error?.stack && (
            <>
              <label htmlFor="stack">Jejak tumpukan:</label>
              <p
                id="stack"
                className="text-slate-400 break-words overflow-wrap"
              >
                {error.stack}
              </p>
            </>
          )}
          {!error?.message && !error?.stack && (
            <p className="text-slate-400">{error.toString()}</p>
          )}
        </span>
      </details>
    </article>
  );
}
