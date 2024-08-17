import Navigation from "./Navigation";

export default function Layout({ children }) {
  return (
    <div className="pb-20">
      <Navigation />
      <div className="container max-w-screen-xl mx-auto">
        {children}
      </div>
    </div>
  )
}
