const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="py-10 flex h-full items-center justify-center">
      {children}
    </div>
  );
};

export default ClerkLayout;
