import { Link } from "react-router-dom"
import Header from "../layout/Header"

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By creating an account and using Buildernote, you accept these terms of service. If you do not accept the terms, you may not use the service.

Buildernote reserves the right to update these terms. For significant changes, you will be notified via email or an in-app message. Continued use of the service after an update constitutes acceptance of the new terms.`,
  },
  {
    title: "2. What is Buildernote",
    content: `Buildernote is a visual work platform that allows you and your team to:

- Create and organize boards with notes, tasks and files.

- Manage projects, sprints and workflows.

- Collaborate with team members in real time.

- Document code, processes and systems.

We reserve the right to change, expand or discontinue features without notice, though we will endeavor to inform users of significant changes.`,
  },
  {
    title: "3. Your Account",
    content: `To use Buildernote you must create an account. You are responsible for:

- Providing correct and up-to-date information upon registration.

- Keeping your password confidential and secure.

- All activity that takes place under your account.

You may only have one account per person. Sharing account credentials with others is not permitted. If you discover unauthorized access to your account, you must immediately contact us at support@buildernote.io.

We reserve the right to suspend or delete accounts that violate these terms.`,
  },
  {
    title: "4. Your Content",
    content: `All content you create in Buildernote — boards, notes, tasks, files and comments — belongs to you. You grant Buildernote a limited, non-exclusive license to host, store and display your content for the purpose of providing the service.

You are responsible for ensuring that:

- Your content does not infringe third-party rights, including copyright and trademark rights.

- Your content complies with applicable legislation.

- You have the right to share the content you upload to the platform.

Buildernote reserves the right to remove content that violates these terms or applicable legislation.`,
  },
  {
    title: "5. Prohibited Use",
    content: `You may not use Buildernote for:

- Illegal activities or activities contrary to applicable legislation.

- Distributing malware, spam or harmful content.

- Attempting to gain unauthorized access to other users' data or our systems.

- Overloading our infrastructure with automated requests.

- Selling, reselling or renting access to your account to third parties.

- Impersonating another person or organization.

Violation of these rules may result in immediate suspension or deletion of your account.`,
  },
  {
    title: "6. Subscription and Payment",
    content: `Buildernote offers a free basic plan as well as paid subscriptions with extended features.

- The free plan is available without time limitation with the features listed on our website.

- Paid plans are billed monthly or annually, as chosen at purchase.

- Prices may change with at least 30 days notice to existing subscribers.

- Subscriptions renew automatically unless cancelled before the next billing period.

- Refunds are not given for already billed periods, unless otherwise agreed.

For payment questions, contact us at billing@buildernote.io.`,
  },
  {
    title: "7. Availability and Downtime",
    content: `We strive to keep Buildernote available 24/7, but we do not guarantee 100% uptime. We will try to give advance notice of planned maintenance.

Buildernote cannot be held liable for loss of data or loss of earnings as a result of:

- Service interruptions or technical errors.

- Third-party provider downtime (including Firebase).

- Force majeure events.

We recommend that you regularly export important data as a backup.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `Buildernote is provided "as is" without warranties of any kind. To the extent permitted by law:

- Buildernote is not liable for indirect losses, operating losses or consequential damages.

- Our total liability is limited to the amount you have paid for the service in the last 3 months.

Nothing in these terms limits liability for personal injury, gross negligence or fraudulent conduct.`,
  },
  {
    title: "9. Intellectual Property",
    content: `The Buildernote platform, including design, code, logos and trademarks, belongs to Buildernote and is protected by copyright and other intellectual property rights.

You may not copy, modify, distribute or reverse-engineer any part of the platform without written permission from us.

Your content remains yours. See section 4 for details.`,
  },
  {
    title: "10. Termination",
    content: `You can delete your account at any time under account settings. We will delete your data within 30 days of deletion.

We may terminate or suspend your access with immediate effect for violation of these terms, or with 30 days notice if we discontinue the service.

Upon termination, your right to use Buildernote ceases, but the provisions of these terms regarding limitation of liability and intellectual property rights continue to apply.`,
  },
  {
    title: "11. Governing Law",
    content: `These terms are governed by applicable law. Any disputes shall be sought to be resolved amicably. If this is not possible, disputes shall be settled by the competent courts.`,
  },
  {
    title: "12. Contact",
    content: `If you have questions about these terms of service, please contact us:

Email: legal@buildernote.io
Buildernote`,
  },
]

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#1e2433]">
      <Header />
      <div className="bg-[#1e2433] pt-16 pb-12 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-8">
          <span className="text-xs font-semibold tracking-widest text-orange-500 uppercase">Legal</span>
          <h1 className="text-4xl font-bold text-white mt-3 mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            These terms govern your use of Buildernote. Read them carefully — they describe your rights and obligations as a user of our platform.
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
            <Link to="/privacy" className="text-gray-500 hover:text-orange-400 transition-colors">Privacy Policy</Link>
            <Link to="/" className="text-gray-500 hover:text-orange-400 transition-colors">Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms