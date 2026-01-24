import Head from "next/head";
import { Container } from "@/components/Container";

export default function PrivacyPage() {
    return (
        <>
            <Head>
                <title>Privacy Policy | EliteSport</title>
                <meta
                    name="description"
                    content="EliteSport Privacy Policy. Learn how we collect, use, and protect your personal data."
                />
            </Head>

            <div className="bg-brand-black text-brand-ivory">
                {/* Hero Section */}
                <section className="relative -mt-20 overflow-hidden pt-20 sm:-mt-24 sm:pt-24">
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-deepBlue/30 via-brand-black to-brand-black" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(111,175,206,0.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(197,163,91,0.08),transparent_40%)]" />

                    <Container className="relative z-10 py-24 sm:py-32">
                        <div className="max-w-3xl">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="h-px w-10 bg-brand-gold" />
                                <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
                                    Legal
                                </p>
                            </div>
                            <h1 className="font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
                                Privacy Policy
                            </h1>
                            <p className="mt-6 text-lg leading-relaxed text-brand-ivory/70">
                                Your privacy is important to us. Learn how we handle your data.
                            </p>
                        </div>
                    </Container>
                </section>

                {/* Content Section */}
                <section className="pb-24">
                    <Container>
                        <div className="mx-auto max-w-3xl">
                            {/* Who We Are */}
                            <ContentSection title="Who We Are">
                                <p className="text-brand-ivory/80">
                                    Our website address is:{" "}
                                    <a
                                        href="https://www.theelitesport.com"
                                        className="text-brand-gold transition hover:text-brand-lightBlue"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        https://www.theelitesport.com
                                    </a>
                                </p>
                            </ContentSection>

                            {/* Our Privacy Policy */}
                            <ContentSection title="Our Privacy Policy">
                                <ul className="space-y-4 text-brand-ivory/80">
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            All credit/debit cards&apos; details and personally
                                            identifiable information will NOT be stored, sold, shared,
                                            rented or leased to any third parties.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            www.theelitesport.com will not pass any debit/credit card
                                            details to third parties.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            www.theelitesport.com takes appropriate steps to ensure
                                            data privacy and security including through various
                                            hardware and software methodologies. However,
                                            www.theelitesport.com cannot guarantee the security of any
                                            information that is disclosed online.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            www.theelitesport.com is not responsible for the privacy
                                            policies of websites to which it links. If you provide any
                                            information to such third parties, different rules
                                            regarding the collection and use of your personal
                                            information may apply. You should contact these entities
                                            directly if you have any questions about their use of the
                                            information that they collect.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            The Website Policies and Terms &amp; Conditions may be
                                            changed or updated occasionally to meet the requirements
                                            and standards. Therefore, customers are encouraged to
                                            frequently visit these sections to be updated about the
                                            changes on the website. Modifications will be effective on
                                            the day they are posted.
                                        </span>
                                    </li>
                                </ul>
                            </ContentSection>

                            {/* Personal Data Collection */}
                            <ContentSection title="What Personal Data We Collect and Why">
                                <div className="space-y-8">
                                    {/* Comments */}
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold text-brand-gold">
                                            Comments
                                        </h3>
                                        <p className="text-brand-ivory/80">
                                            When visitors leave comments on the site we collect the
                                            data shown in the comments form, and also the
                                            visitor&apos;s IP address and browser user agent string to
                                            help spam detection. An anonymized string created from
                                            your email address (also called a hash) may be provided to
                                            the Gravatar service to see if you are using it. After
                                            approval of your comment, your profile picture is visible
                                            to the public in the context of your comment.
                                        </p>
                                    </div>

                                    {/* Media */}
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold text-brand-gold">
                                            Media
                                        </h3>
                                        <p className="text-brand-ivory/80">
                                            If you upload images to the website, you should avoid
                                            uploading images with embedded location data (EXIF GPS)
                                            included. Visitors to the website can download and extract
                                            any location data from images on the website.
                                        </p>
                                    </div>

                                    {/* Cookies */}
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold text-brand-gold">
                                            Cookies
                                        </h3>
                                        <ul className="space-y-3 text-brand-ivory/80">
                                            <li className="flex gap-3">
                                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-lightBlue" />
                                                <span>
                                                    If you leave a comment on our site you may opt-in to
                                                    saving your name, email address and website in
                                                    cookies. These are for your convenience so that you do
                                                    not have to fill in your details again when you leave
                                                    another comment. These cookies will last for one year.
                                                </span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-lightBlue" />
                                                <span>
                                                    If you visit our login page, we will set a temporary
                                                    cookie to determine if your browser accepts cookies.
                                                    This cookie contains no personal data and is discarded
                                                    when you close your browser.
                                                </span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-lightBlue" />
                                                <span>
                                                    When you log in, we will also set up several cookies
                                                    to save your login information and your screen display
                                                    choices. Login cookies last for two days, and screen
                                                    options cookies last for a year. If you select
                                                    &quot;Remember Me&quot;, your login will persist for
                                                    two weeks. If you log out of your account, the login
                                                    cookies will be removed.
                                                </span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-lightBlue" />
                                                <span>
                                                    If you edit or publish an article, an additional
                                                    cookie will be saved in your browser. This cookie
                                                    includes no personal data and simply indicates the
                                                    post ID of the article you just edited. It expires
                                                    after 1 day.
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Embedded Content */}
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold text-brand-gold">
                                            Embedded Content from Other Websites
                                        </h3>
                                        <p className="text-brand-ivory/80">
                                            Articles on this site may include embedded content.
                                            Embedded content from other websites behaves in the exact
                                            same way as if the visitor has visited the other website.
                                            These websites may collect data about you, use cookies,
                                            embed additional third-party tracking, and monitor your
                                            interaction with that embedded content.
                                        </p>
                                    </div>
                                </div>
                            </ContentSection>

                            {/* Data Retention */}
                            <ContentSection title="How Long We Retain Your Data">
                                <p className="text-brand-ivory/80">
                                    If you leave a comment, the comment and its metadata are
                                    retained indefinitely. For users that register on our website
                                    (if any), we also store the personal information they provide
                                    in their user profile. All users can see, edit, or delete
                                    their personal information at any time (except they cannot
                                    change their username). Website administrators can also see
                                    and edit that information.
                                </p>
                            </ContentSection>

                            {/* Your Rights */}
                            <ContentSection title="What Rights You Have Over Your Data">
                                <p className="text-brand-ivory/80">
                                    If you have an account on this site, or have left comments,
                                    you can request to receive an exported file of the personal
                                    data we hold about you, including any data you have provided
                                    to us. You can also request that we erase any personal data we
                                    hold about you.
                                </p>
                            </ContentSection>

                            {/* Where We Send Data */}
                            <ContentSection title="Where We Send Your Data">
                                <p className="text-brand-ivory/80">
                                    Visitor comments may be checked through an automated spam
                                    detection service.
                                </p>
                            </ContentSection>

                            {/* Contact */}
                            <ContentSection title="Contact Us">
                                <p className="text-brand-ivory/80">
                                    You may contact us at{" "}
                                    <a
                                        href="mailto:info@theelitesport.com"
                                        className="text-brand-gold transition hover:text-brand-lightBlue"
                                    >
                                        info@theelitesport.com
                                    </a>{" "}
                                    if you require further details about our Privacy Policy.
                                </p>
                            </ContentSection>
                        </div>
                    </Container>
                </section>
            </div>
        </>
    );
}

function ContentSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-12 last:mb-0">
            <h2 className="mb-6 font-display text-2xl text-brand-ivory sm:text-3xl">
                {title}
            </h2>
            {children}
        </div>
    );
}
