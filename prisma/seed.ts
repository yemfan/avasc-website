import {
  PrismaClient,
  UserRole,
  CaseVisibility,
  CaseStatus,
  RecoveryStage,
  IndicatorType,
  EvidenceRedactionStatus,
  ClusterPublicStatus,
  RiskLevel,
  ModerationStatus,
  CommentModerationStatus,
  SupportType,
  SupportRequestStatus,
  DonationType,
  PaymentProvider,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding AVASC database...");

  // Clean up in dependency-safe order
  await prisma.auditLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.story.deleteMany();
  await prisma.supportRequest.deleteMany();
  await prisma.scamClusterCase.deleteMany();
  await prisma.scamCluster.deleteMany();
  await prisma.evidenceFile.deleteMany();
  await prisma.caseIndicator.deleteMany();
  await prisma.case.deleteMany();
  await prisma.scamAlert.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const admin = await prisma.user.create({
    data: {
      supabaseUserId: "supabase-admin-001",
      email: "admin@avasc.org",
      displayName: "AVASC Admin",
      role: UserRole.admin,
    },
  });

  const moderator = await prisma.user.create({
    data: {
      supabaseUserId: "supabase-mod-001",
      email: "moderator@avasc.org",
      displayName: "AVASC Moderator",
      role: UserRole.moderator,
    },
  });

  const victim1 = await prisma.user.create({
    data: {
      supabaseUserId: "supabase-victim-001",
      email: "victim1@example.com",
      displayName: "Jane Doe",
      role: UserRole.victim,
      isAnonymousByDefault: true,
    },
  });

  const victim2 = await prisma.user.create({
    data: {
      supabaseUserId: "supabase-victim-002",
      email: "victim2@example.com",
      displayName: "Michael Chen",
      role: UserRole.victim,
    },
  });

  const victim3 = await prisma.user.create({
    data: {
      supabaseUserId: "supabase-victim-003",
      email: "victim3@example.com",
      displayName: "Lisa Wong",
      role: UserRole.victim,
    },
  });

  const victim4 = await prisma.user.create({
    data: {
      supabaseUserId: "supabase-victim-004",
      email: "victim4@example.com",
      displayName: "David Park",
      role: UserRole.victim,
    },
  });

  // Cases
  const case1 = await prisma.case.create({
    data: {
      userId: victim1.id,
      scamType: "Fake Crypto Investment",
      title: "WhatsApp crypto group asked for deposit and tax payment",
      summary:
        "I joined a WhatsApp investment group and was told I needed to pay a tax fee to unlock my profits.",
      fullNarrative:
        "I was added to a WhatsApp group promoting a crypto investment strategy. After initial gains were shown in a fake dashboard, I was told I needed to deposit additional funds and later pay tax before any withdrawal would be released.",
      incidentStartDate: new Date("2026-02-01"),
      incidentEndDate: new Date("2026-02-20"),
      amountLost: "85000.00",
      currency: "USD",
      paymentMethod: "USDT",
      initialContactChannel: "WhatsApp",
      jurisdiction: "California, USA",
      visibility: CaseVisibility.anonymized_public,
      status: CaseStatus.PUBLISHED_ANONYMIZED,
      recoveryStage: RecoveryStage.REPORTED_TO_INSTITUTIONS,
      allowFollowUp: true,
      allowLawEnforcementReferral: true,
      allowCaseMatching: true,
      allowPublicAnonymizedUse: true,
    },
  });

  const case2 = await prisma.case.create({
    data: {
      userId: victim2.id,
      scamType: "Fake Crypto Investment",
      title: "Telegram investment platform refused withdrawal",
      summary:
        "A Telegram contact introduced me to a platform that later demanded a security deposit to withdraw funds.",
      fullNarrative:
        "I was introduced to a crypto platform through Telegram. After depositing USDT several times, my account showed large profits, but when I tried to withdraw, support requested a security deposit and then additional verification fees.",
      incidentStartDate: new Date("2026-02-10"),
      incidentEndDate: new Date("2026-03-01"),
      amountLost: "120000.00",
      currency: "USD",
      paymentMethod: "USDT",
      initialContactChannel: "Telegram",
      jurisdiction: "Nevada, USA",
      visibility: CaseVisibility.anonymized_public,
      status: CaseStatus.CLUSTERED,
      recoveryStage: RecoveryStage.EVIDENCE_GATHERING,
      allowFollowUp: true,
      allowLawEnforcementReferral: true,
      allowCaseMatching: true,
      allowPublicAnonymizedUse: true,
    },
  });

  const case3 = await prisma.case.create({
    data: {
      userId: victim3.id,
      scamType: "Romance Scam",
      title: "Romance contact moved conversation to WhatsApp and asked for investment help",
      summary:
        "Someone I met online built trust, then encouraged me to invest through a fake platform.",
      fullNarrative:
        "The person claimed to be living in California and asked me to continue the conversation on WhatsApp. After weeks of talking, I was encouraged to invest in crypto on a platform they said their uncle used professionally.",
      incidentStartDate: new Date("2026-01-15"),
      incidentEndDate: new Date("2026-02-28"),
      amountLost: "42000.00",
      currency: "USD",
      paymentMethod: "Wire Transfer",
      initialContactChannel: "Dating App",
      jurisdiction: "California, USA",
      visibility: CaseVisibility.anonymized_public,
      status: CaseStatus.PENDING_REVIEW,
      recoveryStage: RecoveryStage.INITIAL_RESPONSE,
      allowFollowUp: true,
      allowLawEnforcementReferral: false,
      allowCaseMatching: true,
      allowPublicAnonymizedUse: true,
    },
  });

  const case4 = await prisma.case.create({
    data: {
      userId: victim4.id,
      scamType: "Fake Recovery Scam",
      title: "Recovery company demanded upfront fee after scam loss",
      summary:
        "After reporting my original loss online, a recovery agent contacted me and asked for advance payment.",
      fullNarrative:
        "A company claiming to recover scam funds reached out and said they had already traced my assets. They requested an upfront compliance fee and sent suspicious documents using a Gmail address and a recently registered domain.",
      incidentStartDate: new Date("2026-03-05"),
      incidentEndDate: new Date("2026-03-12"),
      amountLost: "6500.00",
      currency: "USD",
      paymentMethod: "Wire Transfer",
      initialContactChannel: "Email",
      jurisdiction: "Texas, USA",
      visibility: CaseVisibility.private,
      status: CaseStatus.NEW,
      recoveryStage: RecoveryStage.NOT_STARTED,
      allowFollowUp: true,
      allowLawEnforcementReferral: false,
      allowCaseMatching: true,
      allowPublicAnonymizedUse: false,
    },
  });

  // Indicators
  await prisma.caseIndicator.createMany({
    data: [
      {
        caseId: case1.id,
        indicatorType: IndicatorType.WALLET,
        rawValue: "0xABC123FAKE111",
        normalizedValue: "0xabc123fake111",
        isPublic: true,
        isVerified: true,
        confidenceScore: 95,
      },
      {
        caseId: case1.id,
        indicatorType: IndicatorType.DOMAIN,
        rawValue: "https://primegrowth-asset.com",
        normalizedValue: "primegrowth-asset.com",
        isPublic: true,
        isVerified: true,
        confidenceScore: 90,
      },
      {
        caseId: case1.id,
        indicatorType: IndicatorType.PLATFORM,
        rawValue: "WhatsApp",
        normalizedValue: "whatsapp",
        isPublic: true,
        isVerified: true,
        confidenceScore: 70,
      },
      {
        caseId: case1.id,
        indicatorType: IndicatorType.ALIAS,
        rawValue: "Professor Larson",
        normalizedValue: "professor larson",
        isPublic: true,
        isVerified: false,
        confidenceScore: 55,
      },

      {
        caseId: case2.id,
        indicatorType: IndicatorType.WALLET,
        rawValue: "0xABC123FAKE111",
        normalizedValue: "0xabc123fake111",
        isPublic: true,
        isVerified: true,
        confidenceScore: 97,
      },
      {
        caseId: case2.id,
        indicatorType: IndicatorType.DOMAIN,
        rawValue: "primegrowth-asset.com/login",
        normalizedValue: "primegrowth-asset.com",
        isPublic: true,
        isVerified: true,
        confidenceScore: 88,
      },
      {
        caseId: case2.id,
        indicatorType: IndicatorType.PLATFORM,
        rawValue: "Telegram",
        normalizedValue: "telegram",
        isPublic: true,
        isVerified: true,
        confidenceScore: 70,
      },
      {
        caseId: case2.id,
        indicatorType: IndicatorType.EMAIL,
        rawValue: "support@primegrowth-asset.com",
        normalizedValue: "support@primegrowth-asset.com",
        isPublic: true,
        isVerified: true,
        confidenceScore: 85,
      },

      {
        caseId: case3.id,
        indicatorType: IndicatorType.PHONE,
        rawValue: "+1 (626) 555-7788",
        normalizedValue: "16265557788",
        isPublic: false,
        isVerified: false,
        confidenceScore: 60,
      },
      {
        caseId: case3.id,
        indicatorType: IndicatorType.PLATFORM,
        rawValue: "WhatsApp",
        normalizedValue: "whatsapp",
        isPublic: true,
        isVerified: true,
        confidenceScore: 65,
      },
      {
        caseId: case3.id,
        indicatorType: IndicatorType.ALIAS,
        rawValue: "Emily Zhang",
        normalizedValue: "emily zhang",
        isPublic: false,
        isVerified: false,
        confidenceScore: 40,
      },

      {
        caseId: case4.id,
        indicatorType: IndicatorType.DOMAIN,
        rawValue: "funds-recovery-now.com",
        normalizedValue: "funds-recovery-now.com",
        isPublic: true,
        isVerified: true,
        confidenceScore: 80,
      },
      {
        caseId: case4.id,
        indicatorType: IndicatorType.EMAIL,
        rawValue: "gibsondunn018@gmail.com",
        normalizedValue: "gibsondunn018@gmail.com",
        isPublic: true,
        isVerified: true,
        confidenceScore: 90,
      },
      {
        caseId: case4.id,
        indicatorType: IndicatorType.COMPANY_NAME,
        rawValue: "Treeline Financial Coaching",
        normalizedValue: "treeline financial coaching",
        isPublic: true,
        isVerified: false,
        confidenceScore: 55,
      },
    ],
  });

  // Evidence files
  await prisma.evidenceFile.createMany({
    data: [
      {
        caseId: case1.id,
        fileName: "wallet-transfer-screenshot.png",
        filePath: "case1/wallet-transfer-screenshot.png",
        bucket: "evidence-private",
        mimeType: "image/png",
        fileSize: 284221,
        redactionStatus: EvidenceRedactionStatus.SAFE,
        isReviewed: true,
      },
      {
        caseId: case1.id,
        fileName: "chat-export.pdf",
        filePath: "case1/chat-export.pdf",
        bucket: "evidence-private",
        mimeType: "application/pdf",
        fileSize: 864221,
        redactionStatus: EvidenceRedactionStatus.REDACTED,
        isReviewed: true,
      },
      {
        caseId: case2.id,
        fileName: "platform-dashboard.jpg",
        filePath: "case2/platform-dashboard.jpg",
        bucket: "evidence-private",
        mimeType: "image/jpeg",
        fileSize: 212003,
        redactionStatus: EvidenceRedactionStatus.NOT_REVIEWED,
        isReviewed: false,
      },
      {
        caseId: case4.id,
        fileName: "recovery-contract.pdf",
        filePath: "case4/recovery-contract.pdf",
        bucket: "evidence-private",
        mimeType: "application/pdf",
        fileSize: 512345,
        redactionStatus: EvidenceRedactionStatus.NEEDS_REDACTION,
        isReviewed: true,
      },
    ],
  });

  // Support requests
  const support1 = await prisma.supportRequest.create({
    data: {
      userId: victim1.id,
      caseId: case1.id,
      assignedToId: moderator.id,
      supportType: SupportType.RECOVERY_GUIDANCE,
      status: SupportRequestStatus.IN_PROGRESS,
      note: "User needs help organizing bank and exchange reporting timeline.",
    },
  });

  await prisma.supportRequest.create({
    data: {
      userId: victim4.id,
      caseId: case4.id,
      assignedToId: moderator.id,
      supportType: SupportType.LEGAL_REFERRAL,
      status: SupportRequestStatus.OPEN,
      note: "User wants help evaluating whether recovery agency is fraudulent.",
    },
  });

  // Stories
  const story1 = await prisma.story.create({
    data: {
      userId: victim1.id,
      caseId: case1.id,
      title: "I was told I had to pay tax to unlock my crypto profits",
      slug: "pay-tax-to-unlock-crypto-profits",
      body:
        "At first, the platform seemed legitimate and even showed profits. When I tried to withdraw, they said my account was frozen until I paid tax. I want others to recognize this red flag early.",
      anonymityMode: true,
      moderationStatus: ModerationStatus.APPROVED,
      publishedAt: new Date("2026-03-20"),
    },
  });

  await prisma.story.create({
    data: {
      userId: victim3.id,
      caseId: case3.id,
      title: "How a romance conversation turned into an investment scam",
      body:
        "The relationship felt real at first. Over time, the conversation shifted toward investment opportunities. I’m sharing this so others know how emotional trust can be exploited.",
      anonymityMode: true,
      moderationStatus: ModerationStatus.PENDING,
    },
  });

  // Comments
  await prisma.comment.createMany({
    data: [
      {
        storyId: story1.id,
        userId: victim2.id,
        body: "Thank you for sharing this. The tax-demand trick happened to me too.",
        moderationStatus: CommentModerationStatus.APPROVED,
      },
      {
        storyId: story1.id,
        userId: victim4.id,
        body: "This is very helpful and sadly familiar.",
        moderationStatus: CommentModerationStatus.APPROVED,
      },
    ],
  });

  // Scam clusters
  const cluster1 = await prisma.scamCluster.create({
    data: {
      title: "Fake Crypto Investment Group – Shared Wallet/Domain Pattern",
      slug: "fake-crypto-investment-group-shared-wallet-domain-pattern",
      scamType: "Fake Crypto Investment",
      summary:
        "Multiple reports describe investment platforms that display fake profits and then demand tax, security, or verification payments before allowing withdrawals.",
      publicStatus: ClusterPublicStatus.PUBLISHED,
      riskLevel: RiskLevel.CRITICAL,
      redFlags:
        "Tax payment required before withdrawal; security deposit required; communication moved to WhatsApp or Telegram; fake profit dashboard.",
      commonScript:
        "Your account is profitable, but withdrawals require tax clearance or a security deposit before release.",
      safetyWarning:
        "Do not send additional funds to unlock a withdrawal. This is a common scam pattern.",
      recommendedNextStep:
        "Preserve evidence, report wallet addresses and domains, and contact relevant exchanges or financial institutions.",
    },
  });

  const cluster2 = await prisma.scamCluster.create({
    data: {
      title: "Romance Investment Scam – Trust Building Followed by Trading Pitch",
      slug: "romance-investment-scam-trust-building-trading-pitch",
      scamType: "Romance Scam",
      summary:
        "Victims describe a relationship-building phase followed by pressure to invest in a fake or manipulated trading platform.",
      publicStatus: ClusterPublicStatus.INTERNAL,
      riskLevel: RiskLevel.HIGH,
      redFlags:
        "Conversation quickly moved off-platform; unusual focus on investment opportunity; emotional pressure mixed with financial advice.",
      commonScript:
        "I care about you and want to help you grow your money using this opportunity my family uses.",
      safetyWarning:
        "Do not invest through platforms recommended by someone you only know online without independent verification.",
      recommendedNextStep:
        "Preserve chats, transaction records, and any associated domains, wallets, or phone numbers.",
    },
  });

  const cluster3 = await prisma.scamCluster.create({
    data: {
      title: "Fake Recovery Scam – Shared Email and Website Indicators",
      slug: "fake-recovery-scam-shared-email-and-website-indicators",
      scamType: "Fake Recovery Scam",
      summary:
        "Recovery agents contact previous scam victims and claim they can retrieve funds, but require upfront fees and use unverifiable identities.",
      publicStatus: ClusterPublicStatus.PUBLISHED,
      riskLevel: RiskLevel.HIGH,
      redFlags:
        "Upfront recovery fee; Gmail address claiming major law firm affiliation; suspicious recovery contract; urgent payment pressure.",
      commonScript:
        "We have already traced your funds and can recover them immediately after you pay the compliance or processing fee.",
      safetyWarning:
        "Legitimate recovery assistance should be independently verified. Be cautious of anyone demanding upfront payment.",
      recommendedNextStep:
        "Verify organization identity independently and preserve all communications before sending any funds.",
    },
  });

  // Link cases to clusters
  await prisma.scamClusterCase.createMany({
    data: [
      { scamClusterId: cluster1.id, caseId: case1.id },
      { scamClusterId: cluster1.id, caseId: case2.id },
      { scamClusterId: cluster2.id, caseId: case3.id },
      { scamClusterId: cluster3.id, caseId: case4.id },
    ],
  });

  /*
   * Match/cluster suggestion tables (CaseMatchCache, ClusterIndicatorAggregate,
   * ClusterSuggestion, ClusterMergeSuggestion) are not in prisma/schema.prisma yet.
   * When those models are added, seed them here or via a separate script.
   */

  // Alerts
  await prisma.scamAlert.createMany({
    data: [
      {
        title: "Active crypto withdrawal fee scam pattern reported",
        summary:
          "Multiple victims report being told to pay tax or security deposits before fake crypto platforms will release funds.",
        scamType: "Fake Crypto Investment",
        severity: "critical",
        published: true,
        publishedAt: new Date("2026-03-22"),
      },
      {
        title: "Be cautious of fake recovery agencies using free email accounts",
        summary:
          "Reports show recovery scams often use Gmail addresses and recently created domains while claiming legal or forensic recovery expertise.",
        scamType: "Fake Recovery Scam",
        severity: "high",
        published: true,
        publishedAt: new Date("2026-03-24"),
      },
    ],
  });

  // Donations
  await prisma.donation.createMany({
    data: [
      {
        donorName: "Supporter One",
        donorEmail: "donor1@example.com",
        amount: 10000,
        currency: "usd",
        paymentProvider: PaymentProvider.stripe,
        donationType: DonationType.one_time,
        providerSessionId: "cs_test_001",
        providerTransactionId: "pi_test_001",
        receiptNumber: "AVASC-2026-0001",
        receiptSentAt: new Date("2026-03-20"),
      },
      {
        donorName: "Monthly Supporter",
        donorEmail: "monthly@example.com",
        paymentProvider: PaymentProvider.stripe,
        donationType: DonationType.monthly,
        providerSessionId: "cs_test_002",
        providerSubscriptionId: "sub_test_001",
        monthlyConfirmationSentAt: new Date("2026-03-21"),
      },
    ],
  });

  // Audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorUserId: admin.id,
        entityType: "Case",
        entityId: case1.id,
        action: "PUBLISHED_ANONYMIZED",
        metadataJson: {
          note: "Approved for anonymized public use after review.",
        },
      },
      {
        actorUserId: moderator.id,
        entityType: "SupportRequest",
        entityId: support1.id,
        action: "ASSIGNED_TO_MODERATOR",
        metadataJson: {
          assignedTo: moderator.email,
        },
      },
      {
        actorUserId: admin.id,
        entityType: "ScamCluster",
        entityId: cluster1.id,
        action: "PUBLISHED_CLUSTER",
        metadataJson: {
          riskLevel: "CRITICAL",
        },
      },
      {
        actorUserId: moderator.id,
        entityType: "Story",
        entityId: story1.id,
        action: "APPROVED_STORY",
        metadataJson: {
          slug: story1.slug,
        },
      },
    ],
  });

  console.log("AVASC seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
