import Head from "next/head";
import { Container } from "@/components/Container";

export default function TermsPage() {
    return (
        <>
            <Head>
                <title>Terms &amp; Conditions | EliteSport</title>
                <meta
                    name="description"
                    content="Terms and Conditions for EliteSport membership and services. Read our policies on payments, cancellations, and health club rules."
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
                                Terms &amp; Conditions
                            </h1>
                            <p className="mt-6 text-lg leading-relaxed text-brand-ivory/70">
                                Please read these terms carefully before using our services.
                            </p>
                        </div>
                    </Container>
                </section>

                {/* Content Section */}
                <section className="pb-24">
                    <Container>
                        <div className="mx-auto max-w-3xl">
                            {/* General Terms */}
                            <ContentSection title="General Terms">
                                <ul className="space-y-4 text-brand-ivory/80">
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            Elite Sport Brokerage maintains the www.theelitesport.com
                                            Website (&quot;Site&quot;).
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            United Arab Emirates is our country of domicile and
                                            stipulate that the governing law is the local law.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            Any purchase, dispute or claim arising out of or in
                                            connection with this website shall be governed and
                                            construed in accordance with the laws of UAE.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            Visa or MasterCard debit and credit cards in AED will be
                                            accepted for payment.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            The displayed price and currency at the checkout page,
                                            will be the same price and currency printed on the
                                            Transaction Receipt and the amount charged to the card
                                            will be shown in your card currency.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            We will not trade with or provide any services to OFAC and
                                            sanctioned countries.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            Customers using the website who are Minor/under the age of
                                            18 shall not register as a User of the website and shall
                                            not transact on or use the website.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            Cardholder must retain a copy of transaction records and
                                            www.theelitesport.com policies and rules.
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                                        <span>
                                            User is responsible for maintaining the confidentiality of
                                            his account.
                                        </span>
                                    </li>
                                </ul>
                            </ContentSection>

                            {/* Payment Confirmation */}
                            <ContentSection title="Payment Confirmation">
                                <p className="text-brand-ivory/80">
                                    Once the payment is made, the confirmation notice will be sent
                                    to the client via email within 24 hours of receipt and your
                                    membership will get activated.
                                </p>
                            </ContentSection>

                            {/* Cancellation Policy */}
                            <ContentSection title="Cancellation Policy">
                                <p className="text-brand-ivory/80">
                                    Refunds will be done only through the Original Mode of Payment
                                    and will be processed within 10 to 45 days depending on the
                                    issuing bank of the credit card.
                                </p>
                            </ContentSection>

                            {/* Health Club Rules */}
                            <ContentSection title="Health Club Rules and Regulations">
                                <ol className="space-y-4 text-brand-ivory/80">
                                    {[
                                        "Most Health Club premises are open daily for members and guests from 7:00 am to 10:00 pm. However, the Health Club management reserves the right to readjust the operating hours without prior notice or to close the facilities whenever necessary.",
                                        "The Swimming Pool areas in most hotels and fitness centers are open from 8:00 am to 8:00 pm daily.",
                                        "Membership of the Health Club is non-refundable/non-transferable.",
                                        "The management does not accept any responsibility for any loss, theft or damage caused to valuables or personal belongings brought into the Health Club facilities. Lockers are provided for the convenience of the members for clothes and personal belongings. All persons entering the Health Club facilities do so at their own risk.",
                                        "Persons with cold, infectious diseases should refrain from using the facilities.",
                                        "Member's guests who wish to use the facilities will be charged at the listed prices. Admittance of all guests will be at the discretion of the Health Club.",
                                        "Members are kindly requested to submit their membership cards to reception for entrance to the facilities. The management reserves the right to refuse admission to any member not producing their cards.",
                                        "The use of the membership card by any person other than the member will result in cancellation of the membership and forfeiture of the fees.",
                                        "Loss of membership card must be reported to Elite Sport management immediately. An administration fee will be charged for a new card.",
                                        "Entrance during weekends and public holidays are strictly for members only.",
                                        "Domestic helpers/Nannies accompanied by the family are not allowed to enter the Health Club; however they are not permitted to use the facilities.",
                                        "Food and Beverages may not be brought into the Health Club premises (except baby food).",
                                        "Use of the swimming pool and sauna are not permitted if under the influence of alcohol.",
                                        "Smoking is not allowed in the closed areas within the Health Club.",
                                        "Pets are not allowed on the premises for health reasons.",
                                        "Rollerblading, skateboarding and bicycles are strictly prohibited inside the Health Club.",
                                        "Games and activities which are disturbing or dangerous for others are not permitted.",
                                        "The use of radios or cassette/CD players by members or their guests is not permitted in the Health Club.",
                                        "Appropriate dress is required for all activities and functions at the Recreation Facilities. Proper sportswear and shoes are required. Proper swimming attire should be worn at the pool.",
                                        "It is forbidden to remove any of the facility belongings such as sports equipment, towels, etc. from the premises.",
                                        "Member's guests are required to adhere to the rules & regulations of the Health Club facilities and members are advised to notify their guests of these. Members are responsible for the behavior of their guests whilst in the Health Club.",
                                        "Children under 16 years of age are not permitted to use Health Club facilities.",
                                        "You should not have any objection in the event of replacing one hotel with another in emergency circumstances beyond our control.",
                                    ].map((rule, index) => (
                                        <li key={index} className="flex gap-4">
                                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-xs font-semibold text-brand-gold">
                                                {index + 1}
                                            </span>
                                            <span className="pt-0.5">{rule}</span>
                                        </li>
                                    ))}
                                </ol>
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
                                    if you require further details about our Terms and Conditions.
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
