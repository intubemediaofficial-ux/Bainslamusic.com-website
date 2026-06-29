import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bainslamusic.com" },
    update: {},
    create: {
      name: "Ajeet Singh Gurjar",
      email: "admin@bainslamusic.com",
      phone: "+91 9876543210",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
      status: "active",
    },
  });

  // Create staff users
  const staffPassword = await bcrypt.hash("staff123", 10);
  const manager = await prisma.user.upsert({
    where: { email: "manager@bainslamusic.com" },
    update: {},
    create: {
      name: "Manager",
      email: "manager@bainslamusic.com",
      passwordHash: staffPassword,
      role: "MANAGER",
      status: "active",
    },
  });

  const designer = await prisma.user.upsert({
    where: { email: "designer@bainslamusic.com" },
    update: {},
    create: {
      name: "Designer",
      email: "designer@bainslamusic.com",
      passwordHash: staffPassword,
      role: "DESIGNER",
      status: "active",
    },
  });

  const youtubeManager = await prisma.user.upsert({
    where: { email: "youtube@bainslamusic.com" },
    update: {},
    create: {
      name: "YouTube Manager",
      email: "youtube@bainslamusic.com",
      passwordHash: staffPassword,
      role: "YOUTUBE_MANAGER",
      status: "active",
    },
  });

  // Create clients
  const dgMawai = await prisma.client.create({
    data: {
      clientType: "SINGER",
      name: "Dharmendra Kumar",
      stageName: "DG Mawai",
      phone: "+91 9876500001",
      whatsappNumber: "+91 9876500001",
      email: "dgmawai@gmail.com",
      city: "Mawai",
      state: "Rajasthan",
      country: "India",
      revenueSharePercentage: 70,
      status: "ACTIVE",
      createdById: admin.id,
    },
  });

  const lyricist1 = await prisma.client.create({
    data: {
      clientType: "LYRICIST",
      name: "Ramesh Sharma",
      stageName: "Ramesh Sharma",
      phone: "+91 9876500002",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
      revenueSharePercentage: 15,
      status: "ACTIVE",
      createdById: admin.id,
    },
  });

  const composer1 = await prisma.client.create({
    data: {
      clientType: "COMPOSER",
      name: "Sunil Verma",
      stageName: "Sunil Verma",
      phone: "+91 9876500003",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      revenueSharePercentage: 15,
      status: "ACTIVE",
      createdById: admin.id,
    },
  });

  // Create songs
  const song1 = await prisma.song.create({
    data: {
      songTitle: "Shyama Aan Baso Vrindavan Me",
      alternateTitle: "Shyama Come Reside in Vrindavan",
      language: "Hindi",
      category: "BHAJAN",
      genre: "Devotional",
      mood: "Devotional",
      singerId: dgMawai.id,
      lyricistId: lyricist1.id,
      composerId: composer1.id,
      producerName: "Ajeet Singh Gurjar",
      labelName: "Bainsla Music",
      copyrightOwner: "Bainsla Music Pvt. Ltd.",
      currentStage: "RELEASED",
      stageStatus: "COMPLETED",
      audioStatus: "completed",
      videoStatus: "completed",
      artworkStatus: "completed",
      agreementStatus: "signed",
      distributionStatus: "completed",
      youtubeStatus: "completed",
      copyrightStatus: "completed",
      releaseStatus: "released",
    },
  });

  const song2 = await prisma.song.create({
    data: {
      songTitle: "Radhe Tere Charno Ki Dhool",
      alternateTitle: "Dust of Radha's Feet",
      language: "Hindi",
      category: "DEVOTIONAL",
      genre: "Devotional",
      mood: "Devotional",
      singerId: dgMawai.id,
      lyricistId: lyricist1.id,
      composerId: composer1.id,
      producerName: "Ajeet Singh Gurjar",
      labelName: "Bainsla Music",
      copyrightOwner: "Bainsla Music Pvt. Ltd.",
      currentStage: "ARTWORK_PENDING",
      stageStatus: "IN_PROGRESS",
      audioStatus: "completed",
      videoStatus: "completed",
      artworkStatus: "pending",
      agreementStatus: "signed",
      distributionStatus: "pending",
      youtubeStatus: "pending",
      releaseStatus: "pending",
    },
  });

  const song3 = await prisma.song.create({
    data: {
      songTitle: "Sasu Ke Jaaye Tope Case Karugi",
      language: "Hindi",
      category: "RASIYA",
      genre: "Folk",
      mood: "Energetic",
      singerId: dgMawai.id,
      lyricistId: lyricist1.id,
      producerName: "Ajeet Singh Gurjar",
      labelName: "Bainsla Music",
      copyrightOwner: "Bainsla Music Pvt. Ltd.",
      currentStage: "RECORDING_BOOKED",
      stageStatus: "PENDING",
      audioStatus: "pending",
      videoStatus: "pending",
      artworkStatus: "pending",
      agreementStatus: "signed",
      releaseStatus: "pending",
    },
  });

  const song4 = await prisma.song.create({
    data: {
      songTitle: "Na Ek Dusre Ki Ham Taqdeer Me",
      language: "Hindi",
      category: "FOLK",
      genre: "Sad Folk",
      mood: "Sad",
      singerId: dgMawai.id,
      lyricistId: lyricist1.id,
      composerId: composer1.id,
      producerName: "Ajeet Singh Gurjar",
      labelName: "Bainsla Music",
      copyrightOwner: "Bainsla Music Pvt. Ltd.",
      currentStage: "AGREEMENT_PENDING",
      stageStatus: "PENDING",
      audioStatus: "pending",
      agreementStatus: "pending",
      releaseStatus: "pending",
    },
  });

  // Create YouTube channel
  await prisma.youtubeChannel.create({
    data: {
      channelName: "Bainsla Music",
      channelUrl: "https://youtube.com/@bainslamusic",
      category: "Devotional",
      ownerName: "Ajeet Singh Gurjar",
      status: "active",
      subscribersCount: 125000,
      totalViews: 45000000,
      monthlyViews: 2500000,
      monthlyRevenue: 85000,
      rpm: 34,
      ctr: 5.2,
      monetizationStatus: "active",
    },
  });

  // Create tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Record Song - Sasu Ke Jaaye",
        description: "Book studio and record the rasiya song",
        assignedToId: manager.id,
        relatedType: "song",
        relatedId: song3.id,
        priority: "HIGH",
        status: "PENDING",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
      },
      {
        title: "Create Artwork - Radhe Tere Charno Ki Dhool",
        description: "Design YouTube thumbnail and Spotify cover",
        assignedToId: designer.id,
        relatedType: "song",
        relatedId: song2.id,
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
      },
      {
        title: "Get Agreement Signed - Na Ek Dusre Ki",
        description: "Send agreement to DG Mawai for signature",
        assignedToId: manager.id,
        relatedType: "song",
        relatedId: song4.id,
        priority: "URGENT",
        status: "PENDING",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
      },
      {
        title: "Generate YouTube SEO for all pending songs",
        assignedToId: youtubeManager.id,
        priority: "MEDIUM",
        status: "PENDING",
        createdById: admin.id,
      },
    ],
  });

  // Create AI settings
  await prisma.aiSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      aiProvider: "openai",
      textModel: "gpt-4",
      imageModel: "dall-e-3",
      temperature: 0.7,
      maxTokens: 2000,
      defaultLanguage: "Hindi",
      companyTone: "professional",
      saveHistory: true,
    },
  });

  // Create notifications for admin
  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        title: "Agreement Missing",
        message: "Song 'Na Ek Dusre Ki Ham Taqdeer Me' needs agreement signed before proceeding.",
        type: "agreement",
        relatedType: "song",
        relatedId: song4.id,
      },
      {
        userId: admin.id,
        title: "Artwork Pending",
        message: "Song 'Radhe Tere Charno Ki Dhool' is waiting for thumbnail approval.",
        type: "artwork",
        relatedType: "song",
        relatedId: song2.id,
      },
      {
        userId: admin.id,
        title: "Recording Scheduled",
        message: "Studio recording for 'Sasu Ke Jaaye' is scheduled this week.",
        type: "recording",
        relatedType: "song",
        relatedId: song3.id,
      },
    ],
  });

  // Create character profiles
  await prisma.characterProfile.createMany({
    data: [
      {
        characterName: "Radha Rani",
        characterType: "Radha",
        description: "Beautiful divine Radha Rani, pink-yellow royal lehenga, golden jewelry, soft glowing face, lotus eyes, calm smile, divine aura.",
        dressStyle: "Royal lehenga, pink and yellow combination",
        jewelryStyle: "Golden traditional jewelry, maang tikka, nose ring",
        hairStyle: "Long braided hair with flowers",
        expressionStyle: "Calm, divine, loving",
        poseStyle: "Graceful, hands in blessing or holding lotus",
        backgroundPreference: "Vrindavan, Prem Mandir, garden with lotus",
        promptTemplate: "Beautiful divine Radha Rani, pink-yellow royal lehenga, golden jewelry, soft glowing face, lotus eyes, calm smile, divine aura, {background}, cinematic lighting, 8k quality",
      },
      {
        characterName: "Lord Krishna",
        characterType: "Krishna",
        description: "Divine Lord Krishna, blue skin, yellow dhoti, peacock feather crown, playing flute, enchanting smile.",
        dressStyle: "Yellow silk dhoti, peacock feather mukut",
        jewelryStyle: "Golden ornaments, Vaijayanti mala",
        hairStyle: "Curly hair with peacock feather",
        expressionStyle: "Playful, divine, enchanting",
        poseStyle: "Playing flute, or blessing devotees",
        backgroundPreference: "Vrindavan, Yamuna river, kadamba tree",
        promptTemplate: "Divine Lord Krishna, blue skin, yellow dhoti, peacock feather crown, playing flute, enchanting smile, {background}, divine glow, 8k quality",
      },
    ],
  });

  // Create brand kits
  await prisma.brandKit.createMany({
    data: [
      {
        brandName: "Bainsla Music Devotional",
        primaryColor: "#FFD700",
        secondaryColor: "#FF6B35",
        fontStyle: "Bold Hindi Devanagari",
        thumbnailStyle: "Warm golden glow, divine characters, large Hindi title",
        devotionalStyle: "Temple background, divine aura, warm colors",
      },
      {
        brandName: "Bainsla Rasiya",
        primaryColor: "#FF1744",
        secondaryColor: "#FF9100",
        fontStyle: "Bold colorful",
        thumbnailStyle: "Bright colors, expressive faces, bold text",
        rasiyaStyle: "Village scene, colorful dress, energetic mood",
      },
      {
        brandName: "DG Mawai Premium",
        primaryColor: "#6200EA",
        secondaryColor: "#00BFA5",
        fontStyle: "Modern premium",
        thumbnailStyle: "Dark premium background, singer photo, gradient text",
      },
    ],
  });

  console.log("Seed completed successfully!");
  console.log("Login: admin@bainslamusic.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
