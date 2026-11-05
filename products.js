/* =========================================================
   SAVCLICK Shop — product list
   ---------------------------------------------------------
   Edit this list to change what appears on shop.html.
   Each product:
     name        (required) Product name shown on the card and popup
     category    (required) Used for the filter chips. Keep spellings consistent.
     description (required) Shown in the popup
     price       (optional) e.g. "₦45,000". Leave out to show "Price on request"
     image       (optional) e.g. "images/shop/magsafe-charger.jpeg"
                 Leave out to show a placeholder tile.
   NOTE: these are starter products. Replace them with your real stock.
   ========================================================= */

const SHOP_PRODUCTS = [
  // ---------- MacBooks ----------
  { name: "MacBook Air 13\" M1 (Used, Grade A)", category: "MacBooks", description: "8GB RAM, 256GB SSD. Fully tested, battery health checked and cleaned in our workshop. Comes with charger." },
  { name: "MacBook Air 13\" M2 (Used, Grade A)", category: "MacBooks", description: "8GB RAM, 256GB SSD in Midnight. Inspected, tested and ready to use, with charger included." },
  { name: "MacBook Air 15\" M2", category: "MacBooks", description: "Large 15-inch Liquid Retina display, 8GB RAM, 256GB SSD. Thin, light and quiet with all-day battery." },
  { name: "MacBook Pro 13\" M1 (Used)", category: "MacBooks", description: "8GB RAM, 512GB SSD with Touch Bar. Workshop-tested with a new battery fitted where needed." },
  { name: "MacBook Pro 14\" M1 Pro", category: "MacBooks", description: "16GB RAM, 512GB SSD. Liquid Retina XDR display, HDMI, SD card slot and MagSafe charging." },
  { name: "MacBook Pro 14\" M3", category: "MacBooks", description: "8GB RAM, 512GB SSD in Space Grey. Great for creative work, development and everyday performance." },
  { name: "MacBook Pro 16\" M1 Max (Used)", category: "MacBooks", description: "32GB RAM, 1TB SSD. Professional power for video editing and 3D work, fully tested." },
  { name: "MacBook Pro 13\" Intel i5 2020 (Used)", category: "MacBooks", description: "8GB RAM, 256GB SSD. A budget-friendly Mac for students and office work, checked and cleaned." },
  { name: "iMac 24\" M1", category: "MacBooks", description: "4.5K Retina display, 8GB RAM, 256GB SSD. Includes Magic Keyboard and Magic Mouse." },
  { name: "Mac mini M2", category: "MacBooks", description: "8GB RAM, 256GB SSD. Compact desktop Mac. Connect your own monitor, keyboard and mouse." },

  // ---------- Replacement parts ----------
  { name: "MacBook Air M1 Screen Assembly", category: "Parts", description: "Complete display assembly for MacBook Air 13\" M1 (A2337). Fitting available in our workshop." },
  { name: "MacBook Pro 13\" Screen Assembly (A2338)", category: "Parts", description: "Replacement display for MacBook Pro 13\" M1/M2. Ask us about professional installation." },
  { name: "MacBook Air Battery (A1466)", category: "Parts", description: "Replacement battery for MacBook Air 13\" 2013–2017. Restores full-day battery life." },
  { name: "MacBook Pro Battery (A2338)", category: "Parts", description: "Replacement battery for MacBook Pro 13\" M1/M2. Installed and calibrated by our technicians." },
  { name: "MacBook Keyboard Replacement (Butterfly)", category: "Parts", description: "Replacement keyboard for 2016–2019 MacBook Pro and Air models with sticky or missing keys." },
  { name: "MacBook Trackpad (A2179)", category: "Parts", description: "Replacement Force Touch trackpad for MacBook Air 13\" 2020." },
  { name: "MacBook Charging Port / USB-C Board", category: "Parts", description: "Replacement USB-C I/O board for MacBooks that no longer charge or detect devices." },
  { name: "MacBook Speaker Set", category: "Parts", description: "Left and right speaker pair to fix crackling, distorted or silent sound." },
  { name: "MacBook SSD Upgrade 512GB", category: "Parts", description: "Storage upgrade for supported MacBook models. Data transfer available on request." },
  { name: "MacBook Fan / Cooling Fan", category: "Parts", description: "Replacement cooling fan for noisy or overheating MacBook Pro models." },
  { name: "MacBook Display Flex Cable", category: "Parts", description: "Fixes the 'flexgate' backlight problem and flickering screens on MacBook Pro." },
  { name: "MacBook Bottom Case", category: "Parts", description: "Replacement bottom case with screws for dented or damaged MacBook bodies." },

  // ---------- Accessories ----------
  { name: "Apple 30W USB-C Power Adapter", category: "Accessories", description: "Original-spec 30W USB-C charger for MacBook Air, iPad and iPhone." },
  { name: "Apple 67W USB-C Power Adapter", category: "Accessories", description: "Fast-charging adapter for MacBook Pro 14\" and MacBook Air 15\"." },
  { name: "MagSafe 3 Charging Cable (2m)", category: "Accessories", description: "Braided MagSafe 3 cable for MacBook Air M2/M3 and MacBook Pro 14\"/16\"." },
  { name: "USB-C to USB-C Charging Cable (2m)", category: "Accessories", description: "Durable cable for charging and data transfer between USB-C devices." },
  { name: "USB-C Multiport Hub (7-in-1)", category: "Accessories", description: "Adds HDMI, USB-A, SD card, micro SD and USB-C power pass-through to your Mac." },
  { name: "MacBook Hard Shell Case 13\"", category: "Accessories", description: "Slim snap-on case that protects your MacBook from scratches and bumps." },
  { name: "MacBook Sleeve 14\"", category: "Accessories", description: "Padded water-resistant sleeve with an accessory pocket for your charger." },
  { name: "Keyboard Cover (Silicone)", category: "Accessories", description: "Keeps dust and spills out of your MacBook keyboard. Washable and thin." },
  { name: "Screen Protector for MacBook", category: "Accessories", description: "Anti-glare, anti-scratch film that applies easily and removes cleanly." },
  { name: "Aluminium Laptop Stand", category: "Accessories", description: "Raises your MacBook to eye level for better posture and cooling." },
  { name: "Apple Magic Mouse", category: "Accessories", description: "Wireless, rechargeable mouse with a Multi-Touch surface." },
  { name: "Apple Magic Keyboard", category: "Accessories", description: "Wireless, rechargeable keyboard that pairs automatically with your Mac." },
  { name: "Portable SSD 1TB (USB-C)", category: "Accessories", description: "Fast external storage for backups, Time Machine and large video files." },
  { name: "Laptop Backpack", category: "Accessories", description: "Padded backpack that fits up to 16\" laptops, with space for chargers and accessories." },

  // ---------- Smart home ----------
  { name: "Smart Wi-Fi Light Switch (1 Gang)", category: "Smart Home", description: "Control your lights from your phone or by voice, and set schedules. Works with Alexa and Google." },
  { name: "Smart Wi-Fi Light Switch (3 Gang)", category: "Smart Home", description: "Three-way smart wall switch for rooms with several lights. Professional installation available." },
  { name: "Smart Plug", category: "Smart Home", description: "Turn any appliance into a smart device. Timers, schedules and energy monitoring." },
  { name: "Smart LED Bulb (Colour)", category: "Smart Home", description: "Dimmable colour bulb you control from your phone. No hub needed." },
  { name: "Smart Door Lock", category: "Smart Home", description: "Unlock with fingerprint, PIN, card or phone. Ideal for homes, offices and hotel rooms." },
  { name: "Hotel Room Card Lock", category: "Smart Home", description: "RFID card lock system for hotels and short-let apartments, with management software." },
  { name: "Wi-Fi Security Camera (Indoor)", category: "Smart Home", description: "1080p camera with night vision, motion alerts and two-way audio." },
  { name: "Wi-Fi Security Camera (Outdoor)", category: "Smart Home", description: "Weatherproof 2K camera with colour night vision and phone alerts." },
  { name: "Video Doorbell", category: "Smart Home", description: "See and speak to visitors from your phone, wherever you are." },
  { name: "Smart Curtain Motor", category: "Smart Home", description: "Open and close curtains automatically on a schedule or by voice." },
  { name: "Motion Sensor", category: "Smart Home", description: "Triggers lights, alarms or alerts when movement is detected." },
  { name: "Smart Home Hub", category: "Smart Home", description: "Connects your smart devices so they work together in one app." },
  { name: "Smart Thermostat / AC Controller", category: "Smart Home", description: "Control your air conditioner from your phone and save on energy." },
  { name: "Smart Gate Opener", category: "Smart Home", description: "Open your gate from your phone and share access with family or staff." },
];
