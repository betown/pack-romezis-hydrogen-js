export function GuestAccountLayout({children}) {
  return (
    <section
      className="px-contained py-contained"
      data-comp={GuestAccountLayout.displayName}
    >
      {children}
    </section>
  );
}

GuestAccountLayout.displayName = 'AccountLayout.Guest';
