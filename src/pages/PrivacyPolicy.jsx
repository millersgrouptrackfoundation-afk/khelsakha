import { Link } from "react-router-dom"

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/login" className="text-sm text-[#E76F51] hover:underline">← Back to KhelSakha</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <img src="/logo.png" alt="KhelSakha" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Privacy Policy</h1>
              <p className="text-sm text-gray-500 mt-1">KhelSakha by Miller Group Track Foundation</p>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-6">Last updated: June 2026</div>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-lg font-semibold text-[#1A3B2E] mb-3">1. Who we are</h2>
              <p className="leading-relaxed">KhelSakha is a school sports management platform developed by Miller Group Track Foundation (MGTF), based in Gwalior, Madhya Pradesh, India. We build tools for PE teachers, school administrators, and guardians to manage physical education programs.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A3B2E] mb-3">2. What data we collect</h2>
              <p className="leading-relaxed mb-3">We collect only the data necessary to provide the KhelSakha service:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Account information — name, email address, role (teacher, admin, guardian)</li>
                <li>School information — school name and address</li>
                <li>Student records — name, roll number, class, date of birth, gender</li>
                <li>Academic data — attendance records, skill scores, lesson plans</li>
                <li>Medical flags — health conditions relevant to physical education (e.g. asthma, allergies)</li>
                <li>Emergency contact information for students</li>
                <li>Session data — PE session logs, coach evaluations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A3B2E] mb-3">3. How we use your data</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>To provide the KhelSakha platform and its features</li>
                <li>To generate CBSE-compliant PE assessment reports</li>
                <li>To allow guardians to monitor their child's physical education progress</li>
                <li>To help schools manage sports equipment and events</li>
                <li>We do not sell your data to any third party</li>
                <li>We do not use your data for advertising</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A3B2E] mb-3">4. Data storage and security</h2>
              <p className="leading-relaxed">Your data is stored securely on Supabase (PostgreSQL), hosted in the South Asia (Mumbai) region. We use Row Level Security (RLS) to ensure each school can only access its own data. All data is transmitted over encrypted HTTPS connections.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A3B2E] mb-3">5. Children's data</h2>
              <p className="leading-relaxed">KhelSakha stores data about students including minors. This data is entered only by authorised school staff (PE teachers and administrators). Guardians can view their own child's data only. We treat all student data with the highest level of care and do not share it outside the school's authorised users.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A3B2E] mb-3">6. Third party services</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Supabase — database and authentication (supabase.com)</li>
                <li>Vercel — web hosting (vercel.com)</li>
                <li>Anthropic Claude API — AI Mentor feature (anthropic.com)</li>
                <li>Google Fonts — typography (fonts.google.com)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A3B2E] mb-3">7. Your rights</h2>
              <p className="leading-relaxed">You have the right to access, correct, or delete your personal data. School administrators can manage their school's data directly through the Settings page. For data deletion requests, contact us at the email below.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A3B2E] mb-3">8. Data retention</h2>
              <p className="leading-relaxed">We retain your data as long as your school has an active KhelSakha account. When an account is closed, data is deleted within 30 days upon request.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A3B2E] mb-3">9. Contact us</h2>
              <p className="leading-relaxed">If you have any questions about this Privacy Policy or how we handle your data, please contact us:</p>
              <div className="mt-3 p-4 bg-[#F9F7F3] rounded-xl">
                <p className="font-semibold text-[#1A3B2E]">Miller Group Track Foundation</p>
                <p className="text-gray-600">Gwalior, Madhya Pradesh, India</p>
                <p className="text-gray-600">Email: info@millersgrouptrackfoundation.org</p>
                <p className="text-gray-600">Website: millersgrouptrackfoundation.org</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1A3B2E] mb-3">10. Changes to this policy</h2>
              <p className="leading-relaxed">We may update this Privacy Policy from time to time. We will notify users of significant changes through the app. Continued use of KhelSakha after changes constitutes acceptance of the updated policy.</p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">KhelSakha v6 · Miller Group Track Foundation · Khelo. Seekho. Badho.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
