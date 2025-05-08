import requests
import streamlit as st

API_URL = "http://localhost:5000/api/jobs"

st.set_page_config(page_title="Everyday Fresher IT Jobs", layout="wide")

st.markdown("""
    <style>
        .job-card {
            border: 1px solid #e0e0e0;
            padding: 20px;
            border-radius: 12px;
            background-color: #ffffff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            margin-bottom: 20px;
        }
        .job-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 5px;
        }
        .company-name {
            font-size: 16px;
            font-weight: 500;
            color: #4a4a4a;
        }
        .location {
            font-size: 14px;
            color: #888;
        }
        .company-description {
            font-size: 14px;
            color: #555;
            margin-top: 10px;
        }
        .job-link {
            color: #007BFF;
            font-weight: 500;
            text-decoration: none;
        }
        .job-link:hover {
            text-decoration: underline;
        }
    </style>
""", unsafe_allow_html=True)

st.title("🌐 Everyday Fresher IT Jobs")
st.caption("Live job feed powered by Bp's Tech")
st.markdown("---")

try:
    response = requests.get(API_URL)
    response.raise_for_status()
    data = response.json()

    jobs = data.get("jobs", []) if isinstance(data, dict) else data

    if isinstance(jobs, list):
        cols = st.columns(2)
        for i, job in enumerate(jobs):
            col = cols[i % 2]
            with col:
                st.markdown(f"""
                    <div class="job-card">
                        <div class="job-title">🧑‍💻 {job.get('title', 'No Title')}</div>
                        <div class="company-name">🏢 {job.get('company_name', 'N/A')}</div>
                        <div class="location">📍 {job.get('location', 'N/A')}</div>
                        <a class="job-link" href="{job.get('url', '#')}" target="_blank">🔗 View Job Posting</a>
                    </div>
                """, unsafe_allow_html=True)
    else:
        st.error("⚠️ Unexpected data format from backend.")
except Exception as e:
    st.error(f"❌ Failed to fetch jobs. Please make sure the backend is running.\n\nError: {e}")
