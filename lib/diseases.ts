export type Urgency = "routine" | "prompt" | "urgent";

export interface DiseaseInfo {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  urgency: Urgency;
  summary: string;
  hallmarks: string[];
  treatment: string[];
  whenToSeekCare: string;
}

// Normalizes any incoming class label (from the model, in any casing/format)
// to a matchable key: lowercase, alphanumeric only.
export function normalizeKey(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[_\-]+/g, " ")
    .replace(/[^a-z0-9]+/g, "");
}

export const DISEASES: DiseaseInfo[] = [
  {
    id: "melanoma",
    name: "Melanoma",
    aliases: ["melanoma"],
    category: "Malignant neoplasm",
    urgency: "urgent",
    summary:
      "A cancer of the pigment-producing melanocytes. It is the most serious form of skin cancer because it can spread to other organs if not caught early.",
    hallmarks: [
      "Asymmetric mole or lesion",
      "Irregular, notched borders",
      "Multiple colors within one lesion (brown, black, red, white, blue)",
      "Diameter larger than a pencil eraser (>6mm)",
      "Evolving size, shape, or color over weeks to months"
    ],
    treatment: [
      "Refer urgently to a dermatologist or skin cancer clinic for dermoscopy and biopsy",
      "Wide local excision is the standard treatment once biopsy-confirmed",
      "Sentinel lymph node biopsy may be indicated based on tumor depth",
      "Advanced or metastatic disease may require immunotherapy or targeted therapy under oncology care",
      "Routine full-body skin checks and sun protection for prevention and monitoring"
    ],
    whenToSeekCare:
      "See a dermatologist as soon as possible — ideally within days, not weeks — for any lesion matching these features."
  },
  {
    id: "basalcellcarcinoma",
    name: "Basal Cell Carcinoma",
    aliases: ["basal_cell_carcinoma", "basal cell carcinoma", "bcc"],
    category: "Malignant neoplasm",
    urgency: "urgent",
    summary:
      "The most common form of skin cancer, arising from basal cells in the epidermis. It grows slowly and rarely spreads, but can cause significant local tissue damage if untreated.",
    hallmarks: [
      "Pearly or waxy bump, often with visible small blood vessels",
      "Flat, flesh-colored or brown scar-like lesion",
      "A sore that bleeds, oozes, or crusts and does not fully heal",
      "Usually on sun-exposed skin (face, ears, neck, scalp)"
    ],
    treatment: [
      "Biopsy to confirm diagnosis and subtype",
      "Surgical excision or Mohs micrographic surgery for high-risk or facial lesions",
      "Topical therapy (imiquimod or 5-fluorouracil) for select superficial lesions",
      "Curettage and electrodesiccation for low-risk lesions",
      "Radiation therapy for patients who are not surgical candidates",
      "Annual skin surveillance after treatment"
    ],
    whenToSeekCare:
      "Book a dermatology evaluation promptly; while rarely an emergency, early treatment minimizes scarring and tissue loss."
  },
  {
    id: "actinickeratosis",
    name: "Actinic Keratosis",
    aliases: ["actinickeratosis", "actinic keratosis", "solar keratosis"],
    category: "Precancerous lesion",
    urgency: "prompt",
    summary:
      "A rough, scaly patch caused by cumulative sun damage. Considered precancerous, with a small but real risk of progressing to squamous cell carcinoma if untreated.",
    hallmarks: [
      "Dry, rough, sandpaper-like patch",
      "Pink, red, or skin-colored",
      "Usually on chronically sun-exposed areas (face, scalp, forearms, hands)",
      "May be easier to feel than to see"
    ],
    treatment: [
      "Cryotherapy (liquid nitrogen) for isolated lesions",
      "Topical 5-fluorouracil, imiquimod, or diclofenac gel for field treatment of multiple lesions",
      "Photodynamic therapy for widespread sun damage",
      "Curettage for thicker or resistant lesions",
      "Strict daily sun protection to prevent new lesions"
    ],
    whenToSeekCare:
      "Schedule a dermatology visit within a few weeks; seek sooner care if a lesion becomes tender, thickened, or rapidly enlarging."
  },
  {
    id: "xerodermapigmentosum",
    name: "Xeroderma Pigmentosum",
    aliases: ["xerodermapigmentosum", "xeroderma pigmentosum", "xp"],
    category: "Genetic photosensitivity disorder",
    urgency: "urgent",
    summary:
      "A rare inherited disorder that impairs the skin's ability to repair UV-induced DNA damage, causing severe sun sensitivity and a markedly elevated lifetime risk of skin cancers at a young age.",
    hallmarks: [
      "Severe sunburn from minimal sun exposure, often in infancy",
      "Early freckling and pigment changes in sun-exposed skin",
      "Dry, thin, prematurely aged skin",
      "Multiple skin cancers appearing at an unusually young age"
    ],
    treatment: [
      "Referral to a specialized dermatology/genetics center for confirmatory testing",
      "Strict lifelong UV avoidance: protective clothing, UV-blocking films, broad-spectrum sunscreen",
      "Frequent full-body skin surveillance (every 3–6 months) for early cancer detection",
      "Prompt excision of any suspicious lesion",
      "Genetic counseling for the individual and family"
    ],
    whenToSeekCare:
      "Refer to a specialist center promptly — this condition requires coordinated, ongoing management, not a single visit."
  },
  {
    id: "rosacea",
    name: "Rosacea",
    aliases: ["rosacea"],
    category: "Chronic inflammatory condition",
    urgency: "routine",
    summary:
      "A chronic inflammatory condition causing facial redness, visible blood vessels, and sometimes acne-like bumps. Triggers include heat, sun, alcohol, spicy food, and stress.",
    hallmarks: [
      "Persistent central facial redness (cheeks, nose, chin, forehead)",
      "Visible small blood vessels (telangiectasia)",
      "Papules and pustules resembling acne, but without blackheads",
      "Flushing episodes triggered by heat, spicy food, or alcohol",
      "In some cases, thickened skin on the nose (rhinophyma)"
    ],
    treatment: [
      "Topical metronidazole, azelaic acid, or ivermectin cream for inflammatory lesions",
      "Oral doxycycline (low-dose) for moderate to severe cases",
      "Topical brimonidine or oxymetazoline for persistent redness",
      "Daily broad-spectrum sunscreen and gentle, fragrance-free skincare",
      "Trigger avoidance: heat, alcohol, spicy food, extreme temperatures",
      "Laser or light therapy for visible vessels, once inflammation is controlled"
    ],
    whenToSeekCare:
      "A routine dermatology visit is appropriate; seek sooner care if the nose thickens or eyes become persistently irritated (ocular rosacea)."
  },
  {
    id: "scabies",
    name: "Scabies",
    aliases: ["scabies"],
    category: "Parasitic infestation",
    urgency: "prompt",
    summary:
      "A contagious skin infestation caused by the mite Sarcoptes scabiei, producing intense itching, especially at night, and characteristic burrow tracks.",
    hallmarks: [
      "Severe itching, worse at night",
      "Thin, thread-like burrow lines, often between fingers, wrists, or waistline",
      "Small red bumps or blisters",
      "Often affects multiple household or close contacts simultaneously"
    ],
    treatment: [
      "Topical permethrin 5% cream applied to the entire body, left on 8–14 hours, per package instructions",
      "Oral ivermectin as an alternative or for crusted/widespread scabies",
      "Simultaneous treatment of all household and close contacts, even if asymptomatic",
      "Wash bedding, clothing, and towels in hot water; seal non-washables for 72 hours",
      "Antihistamines for itch relief, which can persist for weeks after successful treatment"
    ],
    whenToSeekCare:
      "See a clinician within a few days — it's contagious to close contacts and needs a prescription-strength treatment."
  },
  {
    id: "seborrheicdermatitis",
    name: "Seborrheic Dermatitis",
    aliases: ["seborrheic dermatitis", "seborrheicdermatitis"],
    category: "Chronic inflammatory condition",
    urgency: "routine",
    summary:
      "A common inflammatory condition affecting oil-gland-rich areas, linked to an overgrowth of Malassezia yeast. Known as dandruff when it affects the scalp.",
    hallmarks: [
      "Greasy, yellowish scaling patches",
      "Affects scalp, eyebrows, sides of nose, and behind ears",
      "Mild redness and itching",
      "Tends to flare with stress, cold weather, or fatigue"
    ],
    treatment: [
      "Antifungal shampoo or cream (ketoconazole, ciclopirox, or selenium sulfide)",
      "Low-potency topical corticosteroid for short-term flares",
      "Gentle, fragrance-free cleansers; avoid harsh scrubbing",
      "Regular use of medicated shampoo even between flares to maintain control",
      "Stress management, since flares often track with stress and fatigue"
    ],
    whenToSeekCare:
      "Routine care is fine; see a clinician if over-the-counter antifungal treatment doesn't help after a few weeks."
  },
  {
    id: "tineacorporis",
    name: "Tinea Corporis (Ringworm)",
    aliases: ["tinea corporis", "tineacorporis", "ringworm"],
    category: "Fungal infection",
    urgency: "routine",
    summary:
      "A superficial fungal infection of the skin, commonly called ringworm despite having nothing to do with worms. It spreads via contact with infected people, animals, or surfaces.",
    hallmarks: [
      "Ring-shaped, red, scaly patch with a clearer center",
      "Raised, well-defined advancing border",
      "Mild to moderate itching",
      "Can spread outward slowly over days to weeks"
    ],
    treatment: [
      "Topical antifungal (terbinafine, clotrimazole, or miconazole) applied 2x daily for 2–4 weeks",
      "Oral antifungal (terbinafine or griseofulvin) for widespread or resistant infection",
      "Keep the area clean and dry; avoid sharing towels, clothing, or bedding",
      "Treat any pets showing hair loss or skin lesions, as they can be a source",
      "Continue treatment for the full course even after visible improvement to prevent recurrence"
    ],
    whenToSeekCare:
      "Routine care; see a clinician if the rash doesn't improve after two weeks of an over-the-counter antifungal."
  },
  {
    id: "urticaria",
    name: "Urticaria (Hives)",
    aliases: ["urticaria", "hives"],
    category: "Allergic/immune reaction",
    urgency: "prompt",
    summary:
      "Raised, itchy welts caused by histamine release in the skin, usually from an allergic trigger, infection, or unknown cause. Most cases are acute and self-limited.",
    hallmarks: [
      "Raised, pink or red welts (wheals) with well-defined edges",
      "Intense itching",
      "Individual welts typically resolve within 24 hours, though new ones may appear elsewhere",
      "Can occur with or without swelling of lips, eyes, or throat"
    ],
    treatment: [
      "Non-sedating oral antihistamine (cetirizine, loratadine, or fexofenadine), which can be dosed higher than standard for resistant cases under medical guidance",
      "Identify and avoid the trigger (food, medication, infection, insect sting) if known",
      "Cool compresses for symptomatic relief",
      "Short oral corticosteroid course for severe flares",
      "Refer to allergy/immunology if hives persist beyond 6 weeks (chronic urticaria)"
    ],
    whenToSeekCare:
      "Seek emergency care immediately if hives are accompanied by facial or throat swelling, difficulty breathing, or dizziness — this can signal anaphylaxis."
  },
  {
    id: "urticariapigmentosa",
    name: "Urticaria Pigmentosa",
    aliases: ["urticaria_pigmentosa", "urticaria pigmentosa"],
    category: "Mast cell disorder",
    urgency: "prompt",
    summary:
      "The most common form of cutaneous mastocytosis, caused by an abnormal accumulation of mast cells in the skin. Lesions swell and redden when rubbed (Darier's sign).",
    hallmarks: [
      "Multiple reddish-brown macules or papules",
      "Lesion swells, reddens, or forms a hive when stroked (Darier's sign)",
      "Most common in children, often improving by adolescence",
      "Occasional flushing, itching, or abdominal symptoms from histamine release"
    ],
    treatment: [
      "Referral to dermatology to confirm diagnosis, sometimes with skin biopsy",
      "Oral antihistamines (H1 and H2 blockers) to control itching and flushing",
      "Avoidance of mast-cell degranulation triggers: friction, heat, certain medications (opioids, NSAIDs), alcohol",
      "Mast cell stabilizers (e.g., cromolyn) for gastrointestinal symptoms",
      "In adults or extensive disease, evaluation for systemic mastocytosis"
    ],
    whenToSeekCare:
      "Arrange a dermatology evaluation; seek urgent care if flushing is accompanied by wheezing, fainting, or a rapid drop in blood pressure."
  },
  {
    id: "vitiligo",
    name: "Vitiligo",
    aliases: ["vitiligo"],
    category: "Autoimmune pigmentation disorder",
    urgency: "routine",
    summary:
      "An autoimmune condition in which the immune system attacks melanocytes, causing patches of skin to lose pigment. It is not contagious or physically harmful, but has cosmetic and emotional impact.",
    hallmarks: [
      "Well-defined, milky-white patches of skin",
      "Symmetrical distribution common, often around eyes, mouth, hands, and joints",
      "Hair within a patch may also turn white",
      "Slowly progressive over months to years, though it can stabilize"
    ],
    treatment: [
      "Topical corticosteroids or calcineurin inhibitors (tacrolimus) for localized patches",
      "Narrowband UVB phototherapy for widespread involvement",
      "JAK-inhibitor topical therapy (where available) for repigmentation",
      "Camouflage makeup or self-tanners for cosmetic coverage",
      "Daily sunscreen on depigmented areas, which sunburn more easily",
      "Psychological support/counseling, as the visible change can affect self-esteem"
    ],
    whenToSeekCare:
      "A routine dermatology consult is appropriate to confirm diagnosis and discuss treatment options."
  },
  {
    id: "xanthomas",
    name: "Xanthomas",
    aliases: ["xanthomas", "xanthoma"],
    category: "Lipid deposition disorder",
    urgency: "prompt",
    summary:
      "Yellowish, fatty deposits under the skin caused by lipid accumulation, often signaling an underlying lipid disorder such as high cholesterol or triglycerides, or diabetes.",
    hallmarks: [
      "Yellow-orange, soft papules, plaques, or nodules",
      "Common near the eyelids, elbows, knees, hands, or tendons",
      "Usually painless",
      "May appear alongside other signs of a lipid disorder"
    ],
    treatment: [
      "Fasting lipid panel and blood glucose testing to identify an underlying cause",
      "Management of the underlying condition: statins or other lipid-lowering therapy, dietary changes",
      "Referral to a physician for cardiovascular risk assessment, since xanthomas can be a marker of elevated risk",
      "Surgical excision, laser, or chemical treatment for cosmetic removal once the underlying condition is controlled",
      "Lesions often shrink once lipid levels are treated"
    ],
    whenToSeekCare:
      "Book a general medical evaluation soon — the skin finding is often less important than the underlying lipid or metabolic condition it can reveal."
  },
  {
    id: "acne",
    name: "Acne",
    aliases: ["acne"],
    category: "Follicular inflammatory condition",
    urgency: "routine",
    summary:
      "A common condition of the hair follicles and oil glands, driven by excess oil production, clogged pores, bacteria, and inflammation.",
    hallmarks: [
      "Blackheads and whiteheads (comedones)",
      "Inflamed red papules and pustules",
      "In more severe cases, deeper nodules or cysts",
      "Most common on the face, chest, and back"
    ],
    treatment: [
      "Topical retinoid (adapalene or tretinoin) as a first-line foundation treatment",
      "Benzoyl peroxide to reduce bacteria and inflammation",
      "Topical or oral antibiotics for moderate inflammatory acne",
      "Combined oral contraceptives or spironolactone for hormonally-driven acne in appropriate candidates",
      "Oral isotretinoin for severe, scarring, or treatment-resistant acne, under specialist supervision",
      "Non-comedogenic skincare and avoiding picking or squeezing lesions"
    ],
    whenToSeekCare:
      "Routine care; see a dermatologist if over-the-counter treatment hasn't helped after 2–3 months or if scarring is developing."
  },
  {
    id: "acnevulgaris",
    name: "Acne Vulgaris",
    aliases: ["acnevulgaris", "acne vulgaris"],
    category: "Follicular inflammatory condition",
    urgency: "routine",
    summary:
      "The clinical term for common acne — a chronic condition of the pilosebaceous unit involving comedones, inflammatory papules, pustules, and sometimes nodules or cysts.",
    hallmarks: [
      "Mixed comedonal and inflammatory lesions",
      "Face, chest, back, and shoulders most affected",
      "Ranges from mild comedonal acne to severe nodulocystic acne",
      "Can leave post-inflammatory marks or scarring if untreated"
    ],
    treatment: [
      "Topical retinoid plus benzoyl peroxide as first-line combination therapy",
      "Topical or oral antibiotics for inflammatory lesions, generally time-limited to reduce resistance",
      "Hormonal therapy (oral contraceptives, spironolactone) for appropriate candidates",
      "Oral isotretinoin for severe or scarring disease, with specialist monitoring",
      "Chemical peels or laser therapy as adjuncts for scarring once active acne is controlled"
    ],
    whenToSeekCare:
      "Routine dermatology follow-up is appropriate, sooner if nodules, cysts, or scarring are present."
  },
  {
    id: "allergiccontactdermatitis",
    name: "Allergic Contact Dermatitis",
    aliases: ["allergic_contact_dermatitis", "allergic contact dermatitis"],
    category: "Allergic/immune reaction",
    urgency: "routine",
    summary:
      "A delayed immune reaction that occurs when skin contacts an allergen it has been previously sensitized to — common culprits include nickel, fragrances, preservatives, and plants like poison ivy.",
    hallmarks: [
      "Red, itchy, sometimes blistering rash",
      "Often appears in the exact shape or location of contact with the allergen",
      "Onset typically 24–72 hours after exposure",
      "Can become weepy or crusted if scratched"
    ],
    treatment: [
      "Identify and strictly avoid the triggering allergen (patch testing can help identify unknown triggers)",
      "Topical corticosteroids to reduce inflammation and itching",
      "Oral antihistamines for itch control",
      "Cool compresses and fragrance-free emollients to support the skin barrier",
      "Short oral corticosteroid course for severe or widespread reactions"
    ],
    whenToSeekCare:
      "Routine care for localized rashes; seek prompt care if the rash is widespread, on the face/genitals, or blistering extensively."
  },
  {
    id: "atopicdermatitis",
    name: "Atopic Dermatitis",
    aliases: ["atopic dermatitis", "atopicdermatitis"],
    category: "Chronic inflammatory condition",
    urgency: "routine",
    summary:
      "A chronic, relapsing inflammatory skin condition linked to a compromised skin barrier and immune dysregulation. Often begins in childhood and is associated with allergies and asthma.",
    hallmarks: [
      "Dry, intensely itchy skin",
      "Red, inflamed patches, often in the creases of elbows and knees",
      "Chronic scratching can thicken the skin (lichenification)",
      "Personal or family history of allergies, asthma, or hay fever is common"
    ],
    treatment: [
      "Daily fragrance-free moisturizer applied liberally, ideally right after bathing",
      "Topical corticosteroids for flares, using the lowest effective potency",
      "Topical calcineurin inhibitors (tacrolimus, pimecrolimus) for sensitive areas or maintenance",
      "Antihistamines to help with itching and sleep disruption",
      "Biologic therapy (e.g., dupilumab) for moderate-to-severe cases under specialist care",
      "Identify and avoid personal triggers: harsh soaps, wool, sweating, stress"
    ],
    whenToSeekCare:
      "Routine dermatology care; seek sooner attention if skin becomes infected (yellow crusting, increasing pain, fever)."
  },
  {
    id: "contactdermatitis",
    name: "Contact Dermatitis",
    aliases: ["contact dermatitis", "contactdermatitis"],
    category: "Irritant/allergic reaction",
    urgency: "routine",
    summary:
      "Inflammation of the skin from direct contact with an irritating or allergenic substance. Irritant contact dermatitis (from soaps, solvents, friction) is more common than the allergic form.",
    hallmarks: [
      "Redness, dryness, or cracking at the site of contact",
      "Burning or stinging sensation, sometimes more than itching",
      "Sharp borders that match the area of contact",
      "Can range from mild irritation to painful fissuring with repeated exposure"
    ],
    treatment: [
      "Remove or avoid the offending substance (harsh soap, solvent, prolonged wet work, chemical)",
      "Barrier creams or petroleum-based emollients to protect and repair the skin",
      "Topical corticosteroid for inflamed areas",
      "Wear protective gloves for known occupational or household irritants",
      "Switch to fragrance-free, pH-balanced cleansers"
    ],
    whenToSeekCare:
      "Routine care; see a clinician if the area cracks, becomes painful, or shows signs of infection."
  },
  {
    id: "eczema",
    name: "Eczema",
    aliases: ["eczema"],
    category: "Chronic inflammatory condition",
    urgency: "routine",
    summary:
      "An umbrella term for inflammatory skin conditions causing dry, itchy, inflamed patches. Atopic dermatitis is the most common type, but the term also covers related dermatitis patterns.",
    hallmarks: [
      "Dry, scaly, itchy patches",
      "Redness and sometimes small fluid-filled bumps",
      "Can flare with stress, weather changes, or irritants",
      "Chronic scratching can lead to thickened, leathery skin"
    ],
    treatment: [
      "Regular, generous use of fragrance-free moisturizer",
      "Topical corticosteroids for active flares",
      "Topical calcineurin inhibitors for maintenance or sensitive areas",
      "Lukewarm (not hot) showers and gentle cleansers",
      "Identify and reduce exposure to personal triggers (irritants, allergens, stress, sweat)"
    ],
    whenToSeekCare:
      "Routine care; seek sooner attention for signs of skin infection or if flares are not controlled with standard measures."
  },
  {
    id: "folliculitis",
    name: "Folliculitis",
    aliases: ["folliculitis"],
    category: "Follicular infection/inflammation",
    urgency: "routine",
    summary:
      "Inflammation or infection of hair follicles, usually caused by bacteria (commonly Staphylococcus aureus), but sometimes fungal, viral, or from irritation such as shaving or occlusive clothing.",
    hallmarks: [
      "Small red bumps or white-headed pustules centered on hair follicles",
      "Mild itching or tenderness",
      "Common on the scalp, beard area, thighs, and buttocks",
      "Can follow shaving, waxing, hot tub use, or tight clothing"
    ],
    treatment: [
      "Warm compresses to encourage drainage of superficial lesions",
      "Topical antibiotic (clindamycin or mupirocin) for bacterial folliculitis",
      "Antifungal treatment if a yeast (Malassezia) cause is suspected, especially on the chest/back",
      "Oral antibiotics for widespread or recurrent bacterial folliculitis",
      "Avoid shaving the area until resolved, or switch to an electric razor",
      "Good hot-tub and swimwear hygiene to prevent 'hot tub folliculitis'"
    ],
    whenToSeekCare:
      "Routine care; see a clinician if lesions are spreading, increasingly painful, or accompanied by fever."
  },
  {
    id: "keloid",
    name: "Keloid",
    aliases: ["keloid"],
    category: "Fibroproliferative scar disorder",
    urgency: "routine",
    summary:
      "An overgrowth of scar tissue that extends beyond the boundaries of the original wound, caused by excess collagen production during healing. More common in darker skin tones and certain body sites.",
    hallmarks: [
      "Raised, firm, shiny nodule or plaque",
      "Extends beyond the original injury or piercing site",
      "Pink, red, or darker than surrounding skin",
      "Can be itchy or tender; grows slowly over months"
    ],
    treatment: [
      "Intralesional corticosteroid injections (triamcinolone) as first-line therapy",
      "Silicone gel sheeting or silicone gel applied consistently for several months",
      "Pressure therapy for keloids on ears or after known high-risk procedures",
      "Cryotherapy or laser therapy as adjuncts for select lesions",
      "Surgical excision only in combination with adjuvant therapy (injection, radiation, or silicone), since excision alone has a high recurrence rate",
      "Discuss keloid risk before elective piercings or procedures if there is a personal or family history"
    ],
    whenToSeekCare:
      "Routine dermatology consult; earlier treatment of new keloids generally responds better than long-standing ones."
  }
];

const LOOKUP: Map<string, DiseaseInfo> = new Map();
for (const d of DISEASES) {
  LOOKUP.set(normalizeKey(d.id), d);
  for (const a of d.aliases) {
    LOOKUP.set(normalizeKey(a), d);
  }
}

export function findDisease(label: string): DiseaseInfo | undefined {
  return LOOKUP.get(normalizeKey(label));
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  routine: "Routine follow-up",
  prompt: "See a clinician promptly",
  urgent: "Seek care urgently"
};

export const URGENCY_COLOR: Record<Urgency, string> = {
  routine: "text-clinical-600",
  prompt: "text-signal-amber",
  urgent: "text-signal-red"
};
