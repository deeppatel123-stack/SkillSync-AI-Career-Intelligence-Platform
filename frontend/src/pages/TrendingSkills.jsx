import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import aiApi from '../utils/aiApi';
import { getSession } from '../utils/userSession';

export default function TrendingSkills() {
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [trendRes, catRes] = await Promise.all([
          aiApi.getTrendingSkills(),
          aiApi.getTrendingCategories(),
        ]);
        setTrending(trendRes.data || []);
        setCategories(catRes.data || []);
      } catch (e) {
        console.error('Failed to load trending data');
      }

      try {
        const user = getSession();
        if (user) {
          const profile = await aiApi.getStudentProfile();
          const skills = profile.data?.skills || [];
          setUserSkills(skills);

          if (skills.length) {
            const recRes = await aiApi.getRecommendedSkills({ skills });
            setRecommended(recRes.data?.recommended || []);
          }
        }
      } catch (e) {
        // Not logged in or no profile
      }

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <AppLayout role="student">
        <div className="container-fluid px-3 py-5 text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading trending skills...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role="student">
      <div className="container-fluid px-3">
        <div className="welcome-box">
          <div className="welcome-content">
            <h2>Trending Skills</h2>
            <p className="text-muted">Discover in-demand skills and plan your learning journey</p>
          </div>
          <div className="welcome-icon">
            <i className="bi bi-graph-up-arrow" />
          </div>
        </div>

        {/* Section 1: Top Trending Skills */}
        <div className="row mt-4">
          <div className="col-12">
            <h4 className="section-title">
              <i className="bi bi-fire me-2" />
              Top Trending Skills
            </h4>
          </div>
          {trending.length ? (
            trending.slice(0, 8).map((skill) => (
              <div className="col-lg-3 col-md-4 col-sm-6 mt-3" key={skill.name}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title mb-0">{skill.name}</h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 mt-3">
              <p className="text-muted">No trending skills data available yet.</p>
            </div>
          )}
        </div>

        {/* Section 2: Skills You Already Have */}
        <div className="row mt-5">
          <div className="col-12">
            <h4 className="section-title">
              <i className="bi bi-check-circle me-2" />
              Skills You Already Have
            </h4>
          </div>
          <div className="col-12 mt-3">
            {userSkills.length ? (
              <div className="d-flex flex-wrap gap-2">
                {userSkills.map((s) => (
                  <span key={s} className="badge bg-success fs-6 px-3 py-2">
                    <i className="bi bi-check-lg me-1" /> {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted">
                No skills in your profile yet.{' '}
                {getSession() && (
                  <a href="/student/profile">Update your profile</a>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Recommended Skills */}
        <div className="row mt-5">
          <div className="col-12">
            <h4 className="section-title">
              <i className="bi bi-star me-2" />
              Recommended Skills to Learn Next
            </h4>
          </div>
          <div className="col-12 mt-3">
            {recommended.length ? (
              <div className="row g-3">
                {recommended.slice(0, 8).map((s) => (
                  <div className="col-lg-3 col-md-4 col-sm-6" key={s.name}>
                    <div className="card h-100 border-0 shadow-sm bg-light">
                      <div className="card-body d-flex align-items-center justify-content-center py-4">
                        <span className="fw-semibold text-dark fs-6">{s.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : userSkills.length ? (
              <p className="text-muted">Great! You already have trending skills. Keep learning!</p>
            ) : (
              <p className="text-muted">Add skills to your profile to get personalized recommendations.</p>
            )}
          </div>
        </div>

        {/* Section 4: Trending Categories */}
        <div className="row mt-5 mb-4">
          <div className="col-12">
            <h4 className="section-title">
              <i className="bi bi-tags me-2" />
              Trending Categories
            </h4>
          </div>
          {categories.length ? (
            categories.map((cat) => (
              <div className="col-lg-4 col-md-6 mt-3" key={cat.name}>
                <div className="card h-100">
                  <div className="card-header bg-transparent">
                    <h5 className="mb-0">{cat.name}</h5>
                  </div>
                  <div className="card-body">
                    {cat.skills.length ? (
                      <div className="d-flex flex-wrap gap-2">
                        {cat.skills.map((s) => (
                          <span key={s.name} className="badge bg-info fs-6 px-3 py-2">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted small mb-0">No skills data for this category</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}
