const Footer = () => {
  return (
  <footer>
    {/* Update URL when website will be deployed */}
    <a href="#" className="btn btn-small btn-primary redirect">
      <span>Aller sur le site de l&apos;USMV</span>
      <i className="fa-solid fa-arrow-right"></i>
    </a>
    <div className="social-networks">
      <i className="fa-brands fa-instagram"></i>
      <i className="fa-brands fa-square-facebook"></i>
    </div>
    <div className="copyright">
      Copyright © 2022 USMV
    </div>
  </footer>
  )
}

export default Footer