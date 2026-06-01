import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, ShieldCheck, Network, Mail, MessageSquare, Lightbulb } from "lucide-react";

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">{children}</code>
);

const Block = ({ children }: { children: React.ReactNode }) => (
  <pre className="overflow-x-auto rounded-md bg-muted/60 p-3 text-[12px] leading-relaxed font-mono whitespace-pre-wrap">
    {children}
  </pre>
);

const QA = ({ q, children }: { q: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <p className="text-sm font-semibold text-foreground">{q}</p>
    <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
  </div>
);

export default function StripeAssessment() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="uppercase tracking-wider text-[10px]">
              Take-home · Yeeld
            </Badge>
            <Badge className="bg-accent text-accent-foreground">3–5 hours</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Stripe API & Client Communication Assessment</h1>
          <p className="text-muted-foreground max-w-3xl">
            Worked solutions to the Yeeld take-home. Part 1 covers Stripe API mechanics (Customers, Auth/Capture,
            Connect). Part 2 covers client communication and reflection. Placeholder IDs are marked
            <Code>cus_…</Code>, <Code>pi_…</Code>, <Code>acct_…</Code>, <Code>req_…</Code> — replace with real
            values after running the calls against your test-mode account.
          </p>
        </div>

        {/* Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Setup checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Create a Stripe account, set Country = United States, leave in <strong>test mode</strong> (do not activate).</p>
            <p>2. Settings → Team → invite <Code>careers@theyeeld.com</Code> as <strong>Developer</strong>.</p>
            <p>3. Fork the Stripe Postman workspace and set <Code>{`{{secret_key}}`}</Code> from the API keys page.</p>
            <p>4. Capture your account ID (<Code>acct_XXXXXXXXXX</Code>) for submission.</p>
          </CardContent>
        </Card>

        {/* PART 1 */}
        <div className="flex items-center gap-3 pt-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Part 1 · Technical API</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Q1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-accent" />
              Question 1 — Customer Objects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a Customer, then a Checkout Session in <Code>setup</Code> mode to save a card on file for
              future MIT/CIT charges.
            </p>
            <div>
              <p className="text-sm font-semibold mb-1">Step 1 — Create the customer</p>
              <Block>{`curl https://api.stripe.com/v1/customers \\
  -u $STRIPE_SECRET_KEY: \\
  -d "email=demo@yeeld.test" \\
  -d "name=Demo Merchant" \\
  -d "description=Take-home test customer"`}</Block>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Step 2 — Checkout Session to save a card</p>
              <Block>{`curl https://api.stripe.com/v1/checkout/sessions \\
  -u $STRIPE_SECRET_KEY: \\
  -d "mode=setup" \\
  -d "customer=cus_XXXXXXXXXX" \\
  -d "payment_method_types[]=card" \\
  -d "success_url=https://example.com/success" \\
  -d "cancel_url=https://example.com/cancel"`}</Block>
              <p className="text-xs text-muted-foreground mt-2">
                Complete checkout in the returned <Code>url</Code> using test card <Code>4242 4242 4242 4242</Code>,
                any future expiry, any CVC. Stripe creates a <Code>SetupIntent</Code> and attaches the resulting
                PaymentMethod to the customer.
              </p>
            </div>
            <QA q="a. Customer Object ID">
              <p><Code>cus_XXXXXXXXXX</Code> — paste the ID returned by the create-customer call.</p>
            </QA>
          </CardContent>
        </Card>

        {/* Q2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-accent" />
              Question 2 — Auth & Capture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-1">Step 1 — Authorize $100 (manual capture)</p>
              <Block>{`curl https://api.stripe.com/v1/payment_intents \\
  -u $STRIPE_SECRET_KEY: \\
  -d "amount=10000" \\
  -d "currency=usd" \\
  -d "customer=cus_XXXXXXXXXX" \\
  -d "payment_method=pm_card_visa" \\
  -d "capture_method=manual" \\
  -d "confirm=true" \\
  -d "off_session=true"`}</Block>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Step 2 — Capture $75 of the $100 hold</p>
              <Block>{`curl https://api.stripe.com/v1/payment_intents/pi_XXXXXXXXXX/capture \\
  -u $STRIPE_SECRET_KEY: \\
  -d "amount_to_capture=7500"`}</Block>
            </div>

            <QA q="b. Payment Intent ID">
              <p><Code>pi_XXXXXXXXXX</Code> — from the create-PI response.</p>
            </QA>
            <QA q="c. What happens to the remaining $25?">
              <p>
                Capturing for less than the authorized amount performs a <strong>partial capture</strong>. Stripe
                automatically releases the uncaptured <strong>$25</strong> back to the cardholder — the
                authorization hold is voided on the unused portion. Depending on the issuer, the hold can take a
                few minutes to several business days to disappear from the customer's available balance.
              </p>
            </QA>
            <QA q="d. How do steps A and B show on the customer's bank statement?">
              <p>
                <strong>Authorization (step A):</strong> the issuer places a $100 <em>pending</em> hold against
                available balance. No money has actually moved.
              </p>
              <p>
                <strong>Capture (step B):</strong> the pending line drops off and is replaced by a
                <em> posted</em> $75 charge under the business's statement descriptor. The remaining $25
                hold expires/voids and never posts.
              </p>
            </QA>
            <QA q="e. Business models that need auth-then-capture">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Hotels & car rentals:</strong> authorize at check-in / pickup to guarantee funds and
                  cover incidentals, then capture the final folio (often less, sometimes more) at check-out.
                </li>
                <li>
                  <strong>E-commerce with inventory risk:</strong> authorize at checkout, only capture once the
                  warehouse confirms the item is in stock and shipping — avoids refunds and chargebacks on
                  oversells.
                </li>
                <li>
                  <strong>Marketplaces / on-demand (Uber, DoorDash):</strong> authorize an estimate, capture
                  the actual fare after the ride or delivery is complete.
                </li>
              </ul>
            </QA>
          </CardContent>
        </Card>

        {/* Q3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Network className="h-5 w-5 text-accent" />
              Question 3 — Connect (Express, Destination Charges)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-1">Step 1 — Create the Express connected account</p>
              <Block>{`curl https://api.stripe.com/v1/accounts \\
  -u $STRIPE_SECRET_KEY: \\
  -d "type=express" \\
  -d "country=US" \\
  -d "email=driver@yeeld.test" \\
  -d "capabilities[card_payments][requested]=true" \\
  -d "capabilities[transfers][requested]=true"`}</Block>
              <p className="text-xs text-muted-foreground mt-2">
                Then generate an Account Link (<Code>/v1/account_links</Code>, type=
                <Code>account_onboarding</Code>) and complete onboarding using the Connect test data —
                SSN <Code>000-00-0000</Code>, DOB <Code>01/01/1901</Code>, routing <Code>110000000</Code>,
                account <Code>000123456789</Code>.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Step 2 — Destination charge: rider pays $20, driver gets $15</p>
              <Block>{`curl https://api.stripe.com/v1/payment_intents \\
  -u $STRIPE_SECRET_KEY: \\
  -d "amount=2000" \\
  -d "currency=usd" \\
  -d "payment_method=pm_card_visa" \\
  -d "confirm=true" \\
  -d "application_fee_amount=500" \\
  -d "transfer_data[destination]=acct_XXXXXXXXXX"`}</Block>
            </div>

            <QA q="f. Connect Account ID">
              <p><Code>acct_XXXXXXXXXX</Code> — from the create-account response.</p>
            </QA>
            <QA q="g. Destination-charge Payment Intent ID">
              <p><Code>pi_XXXXXXXXXX</Code> — $20.00 charged to the rider, $15.00 transferred to the driver via <Code>transfer_data[destination]</Code>.</p>
            </QA>
            <QA q="h. Platform fee">
              <p>
                <strong>$5.00</strong> (set as <Code>application_fee_amount=500</Code>). That's the take-rate
                the platform keeps; everything else flows to the connected account.
              </p>
            </QA>
            <QA q="i. Stripe processing fee">
              <p>
                On a US domestic card: <strong>2.9% + $0.30 = $0.88</strong> on a $20 charge. With a destination
                charge the fee is debited from the <em>platform</em> account (the settlement nets to the
                platform's balance, and the platform pays Stripe). So the platform's net on this ride is
                $5.00 fee − $0.88 Stripe fee = <strong>$4.12</strong>; the driver still receives the full $15.
              </p>
            </QA>
            <QA q="j. Charge the driver $2 for a dashboard sign — request ID">
              <p><Code>req_XXXXXXXXXX</Code> — returned in the <Code>Request-Id</Code> response header.</p>
              <Block>{`curl https://api.stripe.com/v1/transfers/tr_XXXXXXXXXX/reversals \\
  -u $STRIPE_SECRET_KEY: \\
  -d "amount=200" \\
  -d "description=Dashboard sign fee"`}</Block>
              <p className="text-xs text-muted-foreground">
                (Alternative if you'd rather debit the driver's balance directly:
                <Code>POST /v1/charges</Code> with header <Code>Stripe-Account: acct_…</Code> and
                <Code>source=acct_…</Code> — but the reversal pattern is cleaner because it ties the $2 back to
                the original transfer for reconciliation.)
              </p>
            </QA>
            <QA q="k. How I solved step J">
              <p>
                The driver doesn't have a customer-style payment method on the platform — they have a Stripe
                <em> balance</em> from the ride. The cleanest way to claw back $2 is a
                <strong> transfer reversal</strong> against the original $15 transfer: it debits the connected
                account's balance and credits the platform's balance for $2, with a clear audit trail linked
                to the source transfer. If we needed to charge the driver beyond their available balance, we'd
                instead create a direct charge on the connected account against a payment method they've
                attached to their Express account.
              </p>
            </QA>
          </CardContent>
        </Card>

        {/* PART 2 */}
        <div className="flex items-center gap-3 pt-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Part 2 · Client Communication</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Q4 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-accent" />
              Question 4 — Streaming service subscriptions (client email reply)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p className="text-muted-foreground italic">Tone: business-stakeholder friendly, but specific enough that the dev team can act on it.</p>
            <Separator />
            <div className="space-y-3 text-foreground">
              <p>Hi [Client],</p>
              <p>
                Congrats on the green light — happy to map this out. Both plans fit cleanly into Stripe Billing,
                and the Python SDK (<Code>stripe-python</Code>) makes the implementation pretty light. Here's the
                shape of it:
              </p>
              <p>
                <strong>The building blocks.</strong> In Stripe you'll create one <em>Product</em> per plan
                ("Streaming — Flat" and "Streaming — Metered"), and one or more <em>Prices</em> under each
                product. Customers get a <em>Subscription</em> tied to a Price, and Stripe handles the monthly
                billing cycle, retries, invoices, and tax automatically.
              </p>
              <p>
                <strong>Plan A — $24.99/month flat.</strong> A standard recurring Price:
                <Code>unit_amount=2499</Code>, <Code>currency=usd</Code>, <Code>recurring.interval=month</Code>.
                Create a Subscription for the customer against that Price and you're done — Stripe charges them
                $24.99 on the same day every month.
              </p>
              <p>
                <strong>Plan B — $10.99 + $1.00 per 10GB after 100GB.</strong> This is a usage-based subscription
                with two components on the same Subscription:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>A flat licensed Price of $10.99/month (the base fee).</li>
                <li>
                  A <em>metered</em> Price billed per "10GB unit," configured as a graduated tier — the first
                  10 units (= 100GB) are <Code>$0.00</Code>, and units above that are <Code>$1.00</Code> each.
                </li>
              </ul>
              <p>
                Each time a user streams, your app reports their usage to Stripe (
                <Code>stripe.SubscriptionItem.create_usage_record</Code> with the GB-in-10GB-chunks for that
                period). At the end of the cycle Stripe automatically rolls usage into the invoice alongside the
                $10.99 base fee.
              </p>
              <Block>{`import stripe
stripe.api_key = STRIPE_SECRET_KEY

# Customer & payment method already exist (Checkout in setup mode handles this).
sub = stripe.Subscription.create(
    customer=customer_id,
    items=[
        {"price": PRICE_BASE_10_99},       # licensed, flat
        {"price": PRICE_METERED_PER_10GB}, # metered, graduated tier
    ],
)

# Later, when a user streams:
stripe.SubscriptionItem.create_usage_record(
    sub["items"]["data"][1]["id"],
    quantity=units_of_10gb_used,
    timestamp=int(time.time()),
    action="increment",
)`}</Block>
              <p>
                <strong>Coupons & promo codes.</strong> Create a <em>Coupon</em> once (e.g. 20% off for 3 months,
                or $5 off forever), then either attach <Code>coupon=…</Code> to the Subscription directly, or
                create a customer-facing <em>Promotion Code</em> on top of it (e.g. <Code>LAUNCH20</Code>) that
                users can type at checkout. Stripe handles the math on every invoice — including correctly
                applying the discount to the metered overage in Plan B.
              </p>
              <p>
                Happy to jump on a 30-minute call to walk through the data model and a recommended event/webhook
                setup (<Code>invoice.paid</Code>, <Code>customer.subscription.updated</Code>, etc.) so your team
                can wire entitlement on/off cleanly.
              </p>
              <p>Best,<br/>[Your name]</p>
            </div>
          </CardContent>
        </Card>

        {/* Q5 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-accent" />
              Question 5 — Difficult client situation (Friday rollback)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p className="text-muted-foreground italic">Goal: take the heat out of the moment, get them unblocked, then handle the "whose fault" conversation with evidence — not finger-pointing.</p>
            <Separator />
            <div className="space-y-3 text-foreground">
              <p>Hi [Client],</p>
              <p>
                Thanks for flagging this so quickly, and sorry it landed on a Friday — I know that's the last
                thing you wanted heading into the weekend. Getting checkout healthy is the priority, so let me
                give you where I am and what I'd suggest as next steps.
              </p>
              <p>
                I dug through the failing sessions and the logs on the Stripe side. The integration we shipped
                is firing correctly — <Code>PaymentIntents</Code> are being created and confirmed as expected in
                test traffic. The errors I'm seeing on the production failures trace back to a change in your
                frontend checkout form from earlier this week (specifically, [brief, specific reference —
                e.g. "the new validation logic on the billing address is stripping the postal code before it
                reaches the <Code>confirmCardPayment</Code> call"]). That's why the rollback fixed it.
              </p>
              <p>
                I want to be useful here, not territorial — so two suggestions:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Right now:</strong> stay on the rollback through the weekend. No reason to take risk
                  before Monday.
                </li>
                <li>
                  <strong>Monday morning:</strong> I'm happy to jump on a 30-min call with your dev team, walk
                  them through what I found in the logs, and pair on the fix so the new frontend can ship
                  cleanly. I'll also put together a short note on the contract Stripe expects from the frontend
                  so this kind of drift is easier to catch in code review going forward.
                </li>
              </ul>
              <p>
                Either way — if anything new pops up over the weekend, text me directly and I'll take a look.
              </p>
              <p>Best,<br/>[Your name]</p>
            </div>
          </CardContent>
        </Card>

        {/* Q6 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-accent" />
              Question 6 — Reflection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              The most ambiguous part was Question 3j — "charge the driver $2 for a dashboard sign." There's no
              built-in concept of a driver paying the platform on a Connect account, so I had to decide between
              two valid paths: a transfer reversal against the original $15 (clean audit trail, but only works
              up to the original transfer amount) or a direct charge on the connected account against a card
              they've attached (works for any amount, but requires more setup). I went with the reversal
              because it's the most realistic pattern for a real rideshare add-on fee and keeps reconciliation
              tied to the originating ride. The other small ambiguity was the Stripe fee question — I called
              out the standard US card rate and noted that with a destination charge the fee is debited from
              the platform's balance, since the question didn't specify who absorbs it.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
