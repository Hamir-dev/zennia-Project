export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs uppercase tracking-[0.14em] text-bone-dim sm:flex-row">
        <span className="font-serif text-sm tracking-[0.08em] text-bone">
          ZENNIA
        </span>
        <span>© {new Date().getFullYear()} Zennia. All rights reserved.</span>
      </div>
    </footer>
  );
}
