import { Link } from "react-router-dom"
import Header from "../layout/Header"

const sections = [
  {
    title: "1. Who We Are",
    content: `Buildernote is a visual work platform for developers, designers and teams. We help you organize projects, tasks, notes and documentation in one place. This privacy policy describes how we collect, use and protect your personal data when you use our service.

Data controller: Buildernote. Questions? Contact us at privacy@buildernote.io.`,
  },
  {
    title: "2. What We Collect",
    content: `When you create an account and use Buildernote, we collect the following information:

- Account information: name, email address and password (encrypted) upon email registration, or your name and email from Google/GitHub for OAuth login.

- Content you create: boards, notes, tasks, comments, files and other data you save in Buildernote. This content belongs to you.

- Usage data: information about how you use the platform, including which features you use, timestamps and browser configuration. We use this to improve the product.

- Technical data: IP address, browser type, device type and operating system for security purposes and troubleshooting.`,
  },
  {
    title: "3. How We Use Your Data",
    content: `We use your information for the following purposes:

- To provide and operate the Buildernote service, including storing your boards and tasks in real time via Firebase Firestore.

- To manage your account, including login, password changes and account deletion.

- To send important service messages, such as updates about your account, security alerts or changes to our terms.

- To improve and debug the product based on anonymized usage data.

- To comply with applicable legislation and protect against misuse.

We never sell your personal data to third parties and do not use it for advertising purposes.`,
  },
  {
    title: "4. Sharing with Third Parties",
    content: `We only share your information with third parties in the following cases:

- Firebase (Google): We use Firebase Authentication and Cloud Firestore to handle login and store your data. Your data is processed in accordance with Google's data protection policy.

- Firebase Storage: Files and images you upload are stored via Firebase Storage.

- Legal requirements: If we are legally obligated to disclose information to authorities, we do so in accordance with applicable legislation.

All third-party providers are data processors and only process data on our behalf and according to our instructions.`,
  },
  {
    title: "5. Data Security",
    content: `We take the security of your data seriously and have implemented the following measures:

- Passwords are hashed with strong encryption and are never stored in plain text.

- All communication between your browser and our servers takes place over HTTPS.

- Firebase Firestore rules ensure that you can only read and write your own data.

- Regular review of security rules and access rights.

No systems are 100% secure. If a security breach occurs that affects your data, we will notify you as soon as possible.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the following rights under GDPR:

- Access: You can at any time request to see the personal data we have registered about you.

- Rectification: You can correct incorrect or incomplete information in your account settings.

- Deletion: You can delete your account and all associated data. We delete your data within 30 days of request.

- Data portability: You can request a copy of your data in a machine-readable format.

- Objection: You can object to the processing of your data.

Contact us at privacy@buildernote.io to exercise your rights.`,
  },
  {
    title: "7. Cookies",
    content: `Buildernote uses cookies and similar technologies to:

- Keep you logged in to your account (session cookie via Firebase Authentication).

- Remember your preferences such as display settings.

- Collect anonymized usage statistics for product improvement.

You can manage cookies in your browser settings. Note that disabling necessary cookies may affect functionality.`,
  },
  {
    title: "8. Data Retention",
    content: `We retain your data for as long as your account is active. If you delete your account, we remove your personal information and content within 30 days, unless we are legally obligated to retain it longer.

Anonymized usage data may be retained for up to 24 months for statistical purposes.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this privacy policy from time to time. For significant changes, we will notify you via email or a clear message in the app. The latest version is always available on this page.

Continued use of Buildernote after an update constitutes acceptance of the updated policy.`,
  },
  {
    title: "10. Contact",
    content: `If you have questions, concerns or wish to exercise your rights, please contact us:

Email: privacy@buildernote.io
Buildernote`,
  },
]

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#1e2433]">
      <Header />
      <div className="bg-[#1e2433] pt-16 pb-12 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-8">
          <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Legal</span>
          <h1 className="text-4xl font-bold text-white mt-3 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            We take your privacy seriously. This policy explains what data we collect, how we use it, and what rights you have as a user of Buildernote.
          </p>
          <p className="text-gray-600 text-sm mt-4">Last updated: March 18, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-[240px_1fr] gap-12">
          <div className="hidden md:block">
            <div className="sticky top-8">
              <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">Contents</p>
              <nav className="space-y-1">
                {sections.map((s, i) => (
                  <a key={i} href={`#section-${i}`} className="block text-sm text-gray-500 hover:text-orange-400 transition-colors py-1">
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="space-y-12">
            {sections.map((s, i) => (
              <div key={i} id={`section-${i}`}>
                <h2 className="text-xl font-bold text-white mb-4">{s.title}</h2>
                <div className="space-y-3">
                  {s.content.split("\n\n").map((para, j) => (
                    <p key={j} className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 Buildernote. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/terms" className="text-gray-500 hover:text-orange-400 transition-colors">Terms of Service</Link>
            <Link to="/" className="text-gray-500 hover:text-orange-400 transition-colors">Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy