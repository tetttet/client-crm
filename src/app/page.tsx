import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link className="bg-black text-white max-w-sm h-10 text-center" href="/dashboard">Это отправляет в главную страницу CRM</Link>
    </>
  );
}
