export default function AuthSidePanel({ title, description, features }) {
  return (
    <div className="col-md-5 d-none d-md-block">
      <div className="auth-side-panel">
        <div className="side-content">
          <h2>{title}</h2>
          <p>{description}</p>
          <div className="side-features">
            {features.map((feature) => (
              <div className="feature-item" key={feature.text}>
                <i className={`bi ${feature.icon}`} />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
