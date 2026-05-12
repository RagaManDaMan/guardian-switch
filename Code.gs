/**
 * GUARDIAN SWITCH - HUMAN-FRIENDLY EDITION
 * A privacy-first safety switch for pet owners.
 * 
 * GitHub: https://github.com/RagaManDaMan/guardian-switch
 */

const ACADEMIC_FACTS = [
  "The 'Immortal Jellyfish' (Turritopsis dohrnii) can revert its cells to their earliest form via transdifferentiation, effectively bypassing biological death.",
  "The Portuguese Man o' War (Physalia physalis) is not a single multicellular organism, but a colonial siphonophore—a collection of specialized polyps working as one.",
  "Naked mole-rats are the only known eusocial mammals, living in colonies with a single breeding queen, similar to certain Hymenoptera species.",
  "The Axolotl (Ambystoma mexicanum) exhibits profound neoteny, reaching sexual maturity without ever undergoing the metamorphosis typical of other amphibians.",
  "Tardigrades can enter a state of cryptobiosis, replacing 97% of their body water with sugar to survive vacuum exposure and extreme ionizing radiation.",
  "The Mimic Octopus (Thaumoctopus mimicus) exhibits facultative mimicry, physically altering its shape and pigment to impersonate specific local predators.",
  "Wood frogs (Lithobates sylvaticus) can survive the freezing of over 60% of their body water by accumulating high concentrations of glucose as a cryoprotectant.",
  "The Lyrebird (Menura novaehollandiae) possesses a syrinx capable of complex vocal mimicry, including perfectly replicating anthropogenic sounds like chainsaws.",
  "Mantis shrimp (Stomatopoda) possess trinocular vision and can perceive circular polarized light, a capability unique in the animal kingdom.",
  "Crows (Corvidae) demonstrate causal reasoning and tool manufacture, capabilities previously thought to be exclusive to the Great Apes.",
  "The Mantis Shrimp's strike is so rapid (23 m/s) that it causes cavitation bubbles, generating heat and light upon collapse.",
  "Honeybees (Apis mellifera) communicate the spatial coordinates of floral resources via the 'waggle dance', encoding both distance and solar angle.",
  "Elephants exhibit 'musth', a periodic condition characterized by a 60-fold increase in testosterone and profound changes in social hierarchy.",
  "The Star-nosed Mole (Condylura cristata) possesses 22 Eimer's organs on its snout, making it the most sensitive tactile organ in any mammal.",
  "Green Sea Slugs (Elysia chlorotica) are capable of kleptoplasty, incorporating chloroplasts from algae into their own cells to perform photosynthesis.",
  "The Peregrine Falcon (Falco peregrinus) reaches speeds of 320 km/h during a hunting stoop, utilizing specialized bone tubercles in its nostrils to manage air pressure.",
  "Male Nursery Web Spiders offer 'nuptial gifts' to females to avoid sexual cannibalism, often wrapping useless items in silk to deceive the mate.",
  "African Grey Parrots have demonstrated the ability to understand the concept of zero and categorize objects by both shape and color simultaneously.",
  "The Pistol Shrimp (Alpheidae) creates a high-pressure bubble that reaches temperatures of 5,000 Kelvin, briefly matching the surface temperature of the sun.",
  "Leafcutter ants (Atta) do not eat leaves; they use them as a substrate to farm a specific genus of fungus (Leucoagaricus), their sole nutrient source."
];

function getConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const props = PropertiesService.getScriptProperties();
  return {
    USER_NAME: sheet.getRange("B1").getValue() || "User",
    FRIENDS_EMAILS: sheet.getRange("B2").getValue(),
    FORM_URL: props.getProperty('FORM_URL'),
    FORM_ID: props.getProperty('FORM_ID'),
    USER_EMAIL: Session.getActiveUser().getEmail()
  };
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🛡️ Guardian Switch')
    .addItem('🚀 Start System', 'installer_runSetup')
    .addSeparator()
    .addItem('🧪 TEST: Send Daily Email', 'sendDailyReminder')
    .addItem('🧪 TEST: Check System Status', 'test_checkStatus')
    .addItem('🧪 TEST: Force Emergency Alert', 'test_forceAlert')
    .addSeparator()
    .addItem('🛑 Stop & Deactivate', 'installer_stop')
    .addToUi();
}

function installer_runSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const props = PropertiesService.getScriptProperties();
  
  if (sheet.getRange("A1").getValue() === "") {
    const labels = [
      ["Your Name", "Sarah"],
      ["Emergency Emails (separated by commas)", "friend1@gmail.com, friend2@gmail.com"],
      ["Alert Grace Period", "Remind at 8 AM, Alert at 10 PM"]
    ];
    sheet.getRange("A1:B3").setValues(labels);
    sheet.getRange("A1:A3").setFontWeight("bold").setBackground("#f1f5f9");
    sheet.getRange("B1:B3").setBackground("#fffbeb");
    sheet.setColumnWidth(1, 350);
    sheet.setColumnWidth(2, 400);
    SpreadsheetApp.getUi().alert("✨ Dashboard Created! Please fill in the details and click Start again.");
    return;
  }

  const config = getConfig();
  if (!config.FRIENDS_EMAILS || config.FRIENDS_EMAILS.includes("friend1@gmail.com")) {
    SpreadsheetApp.getUi().alert("⚠️ Please enter real emergency emails first.");
    return;
  }
  
  if (!config.FORM_URL) {
    const form = FormApp.create(`Guardian Switch Check-in for ${config.USER_NAME}`);
    form.setDescription("Submit this form daily to confirm your safety.");
    form.addSectionHeaderItem().setTitle("Confirmation of Safety");
    props.setProperty('FORM_URL', form.getPublishedUrl());
    props.setProperty('FORM_ID', form.getId());
  }
  
  installer_stop(true);
  ScriptApp.newTrigger('sendDailyReminder').timeBased().everyDays(1).atHour(8).create();
  ScriptApp.newTrigger('checkHeartbeat').timeBased().everyHours(1).create();
  
  props.setProperty('LAST_CHECKIN', new Date().getTime().toString());
  props.setProperty('ALERT_SENT', 'false');
  
  SpreadsheetApp.getUi().alert('✅ Guardian Switch is ACTIVE.\n\nReminder: 8 AM | Final Alert Check: 10 PM');
}

function installer_stop(silent) {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));
  if (silent !== true) SpreadsheetApp.getUi().alert('🛑 System Deactivated.');
}

function sendDailyReminder() {
  const config = getConfig();
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const fact = ACADEMIC_FACTS[dayOfYear % ACADEMIC_FACTS.length];
  const subject = `🐾 Daily Discovery: Biological Insights & Safety Check-in`;
  
  const htmlBody = `
    <div style="font-family: 'Georgia', serif; padding: 40px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 550px; margin: auto; background-color: #ffffff; color: #1a202c;">
      <h2 style="color: #2d3748; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">Good Morning, ${config.USER_NAME}</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-top: 25px;">
        <strong>Daily Discovery:</strong> ${fact}
      </p>
      <div style="margin-top: 40px; text-align: center;">
        <p style="font-size: 14px; color: #718096; margin-bottom: 20px;">Please click below before 10:00 PM tonight to confirm your status.</p>
        <a href="${config.FORM_URL}" style="background-color: #f59e0b; color: white; padding: 15px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">CONFIRM SAFETY STATUS</a>
      </div>
    </div>
  `;
  
  MailApp.sendEmail({
    to: config.USER_EMAIL,
    subject: subject,
    htmlBody: htmlBody
  });
}

function checkHeartbeat() {
  const config = getConfig();
  const props = PropertiesService.getScriptProperties();
  const formId = props.getProperty('FORM_ID');
  
  if (!formId) return;
  
  const form = FormApp.openById(formId);
  const responses = form.getResponses();
  let lastCheckinTime = parseInt(props.getProperty('LAST_CHECKIN') || "0");
  
  if (responses.length > 0) {
    const lastResponseTime = responses[responses.length - 1].getTimestamp().getTime();
    if (lastResponseTime > lastCheckinTime) {
      lastCheckinTime = lastResponseTime;
      props.setProperty('LAST_CHECKIN', lastCheckinTime.toString());
      props.setProperty('ALERT_SENT', 'false');
    }
  }

  const now = new Date();
  const currentHour = now.getHours();
  
  if (currentHour >= 22) {
    const todayLimit = new Date();
    todayLimit.setHours(4, 0, 0, 0);
    
    if (lastCheckinTime < todayLimit.getTime() && props.getProperty('ALERT_SENT') !== 'true') {
      MailApp.sendEmail({
        to: config.FRIENDS_EMAILS,
        subject: `URGENT: Safety Alert for ${config.USER_NAME}`,
        body: `URGENT: ${config.USER_NAME} has missed their daily check-in. The 10:00 PM safety check failed. Please check on them and their animals immediately.`
      });
      props.setProperty('ALERT_SENT', 'true');
    }
  }
}

function test_checkStatus() {
  const props = PropertiesService.getScriptProperties();
  const lastCheckin = parseInt(props.getProperty('LAST_CHECKIN') || "0");
  const todayLimit = new Date();
  todayLimit.setHours(4, 0, 0, 0);
  
  let msg = `System Status:\n\n`;
  msg += `Last Check-in: ${new Date(lastCheckin).toLocaleString()}\n`;
  if (lastCheckin > todayLimit.getTime()) {
    msg += `Status: ✅ SECURE (Checked in today)\n`;
  } else {
    msg += `Status: ⚠️ PENDING (Waiting for today's check-in)\nNext Step: Alert will fire if no check-in by 10:00 PM tonight.`;
  }
  SpreadsheetApp.getUi().alert(msg);
}

function test_forceAlert() {
  const config = getConfig();
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert('⚠️ FORCE ALERT', 'Send test alert to: ' + config.FRIENDS_EMAILS + '?', ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES) {
    MailApp.sendEmail({
      to: config.FRIENDS_EMAILS,
      subject: `[TEST ALERT] Safety Alert for ${config.USER_NAME}`,
      body: `This is a TEST of the Guardian Switch system. If this were real, it would mean ${config.USER_NAME} has missed their check-in.`
    });
    ui.alert('Test alert sent.');
  }
}
