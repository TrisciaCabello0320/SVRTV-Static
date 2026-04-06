import { DB, SECTIONS } from '../data/database';
import { useScrollTo } from '../hooks/useScroll';

export default function Footer() {
  const scrollTo = useScrollTo();

  return (
    <footer id="footer-contact">
      <div className="footer-inner">

        {/* Col 1: Brand */}
        <div className="footer-col">
          <div className="fb-name">Shepherd's Voice</div>
          <div className="fb-full">Radio and Television Foundation Inc.</div>
          <div className="fb-desc">{DB.general.footer_desc}</div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="footer-col">
          <div className="fc-head">Quick Links</div>
          <div className="fc-links">
            {SECTIONS.map((s) => (
              <a key={s.id} href="#" onClick={(e) => { e.preventDefault(); scrollTo(s.id); }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Col 3: Contact */}
        <div className="footer-col">
          <div className="fc-head">Contact Us</div>
          <div className="fct-line">
            <i className="fa fa-map-marker-alt" />
            <span>{DB.general.contact_address}</span>
          </div>
          <div className="fct-line">
            <i className="fa fa-envelope" />
            <span>
              <a href={`mailto:${DB.general.contact_email}`}>{DB.general.contact_email}</a>
            </span>
          </div>
          <div className="fct-line">
            <i className="fa fa-phone" />
            <span>{DB.general.contact_phone}</span>
          </div>
          <div className="fct-line">
            <i className="fa fa-clock" />
            <span>{DB.general.contact_hours}</span>
          </div>

          <div className="fct-social">
            <a
              href={DB.general.social_facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="f-social-btn fsb-fb"
              title="Facebook"
            >
              <i className="fab fa-facebook-f" />
            </a>
            <a
              href={DB.general.social_youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="f-social-btn fsb-yt"
              title="YouTube"
            >
              <i className="fab fa-youtube" />
            </a>
            <a
              href={DB.general.social_instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="f-social-btn fsb-ig"
              title="Instagram"
            >
              <i className="fab fa-instagram" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bot">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="accred-lbl">Accredited by</span>
          <span className="accred-link">
            <a href={DB.general.pcnc_url} target="_blank" rel="noopener noreferrer" title="PCNC">
              <i className="fa fa-certificate" /> PCNC
            </a>
          </span>
        </div>
        <div className="copyright">
          © 2012–2026 SVRTFI &nbsp;·&nbsp; All Rights Reserved &nbsp;·&nbsp;{' '}
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
