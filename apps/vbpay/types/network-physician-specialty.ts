import { z } from "zod";

type NetworkPhysicianSpecialty =
  | "allergy"
  | "clinical & laboratory immunology"
  | "addiction medicine"
  | "critical care medicine"
  | "hospice and palliative medicine"
  | "pain medicine"
  | "pediatric anesthesiology"
  | "clinical & laboratory dermatological immunology"
  | "dermatopathology"
  | "mohs-micrographic surgery"
  | "pediatric dermatology"
  | "procedural dermatology"
  | "emergency medical services"
  | "medical toxicology"
  | "pediatric emergency medicine"
  | "sports medicine"
  | "undersea and hyperbaric medicine"
  | "adolescent medicine"
  | "adult medicine"
  | "geriatric medicine"
  | "obesity medicine"
  | "sleep medicine"
  | "adult congenital heart disease"
  | "advanced heart failure and transplant cardiology"
  | "allergy & immunology"
  | "cardiovascular disease"
  | "clinical cardiac electrophysiology"
  | "endocrinology, diabetes & metabolism"
  | "gastroenterology"
  | "hematology"
  | "hematology & oncology"
  | "hepatology"
  | "hypertension specialist"
  | "infectious disease"
  | "interventional cardiology"
  | "magnetic resonance imaging (mri)"
  | "medical oncology"
  | "nephrology"
  | "pulmonary disease"
  | "rheumatology"
  | "transplant hepatology"
  | "clinical biochemical genetics"
  | "clinical cytogenetics"
  | "clinical genetics (m.d.)"
  | "clinical molecular genetics"
  | "medical biochemical genetics"
  | "molecular genetic pathology"
  | "ph.d. medical genetics"
  | "in vivo & in vitro nuclear medicine"
  | "nuclear cardiology"
  | "nuclear imaging & therapy"
  | "complex family planning"
  | "female pelvic medicine and reconstructive surgery"
  | "gynecologic oncology"
  | "gynecology"
  | "maternal & fetal medicine"
  | "obstetrics"
  | "reproductive endocrinology"
  | "cornea and external diseases specialist"
  | "glaucoma specialist"
  | "neuro-ophthalmology"
  | "ophthalmic plastic and reconstructive surgery"
  | "pediatric ophthalmology and strabismus specialist"
  | "retina specialist"
  | "uveitis and ocular inflammatory disease"
  | "adult reconstructive orthopaedic surgery"
  | "foot and ankle surgery"
  | "hand surgery"
  | "orthopaedic surgery of the spine"
  | "orthopaedic trauma"
  | "pediatric orthopaedic surgery"
  | "facial plastic surgery"
  | "otolaryngic allergy"
  | "otolaryngology/facial plastic surgery"
  | "otology & neurotology"
  | "pediatric otolaryngology"
  | "plastic surgery within the head & neck"
  | "interventional pain medicine"
  | "anatomic pathology"
  | "anatomic pathology & clinical pathology"
  | "blood banking & transfusion medicine"
  | "chemical pathology"
  | "clinical informatics"
  | "clinical pathology"
  | "clinical pathology/laboratory medicine"
  | "cytopathology"
  | "forensic pathology"
  | "immunopathology"
  | "medical microbiology"
  | "neuropathology"
  | "pediatric pathology"
  | "child abuse pediatrics"
  | "developmental - behavioral pediatrics"
  | "neonatal-perinatal medicine"
  | "neurodevelopmental disabilities"
  | "pediatric allergy/immunology"
  | "pediatric cardiology"
  | "pediatric critical care medicine"
  | "pediatric endocrinology"
  | "pediatric gastroenterology"
  | "pediatric hematology-oncology"
  | "pediatric infectious diseases"
  | "pediatric nephrology"
  | "pediatric pulmonology"
  | "pediatric rheumatology"
  | "pediatric transplant hepatology"
  | "brain injury medicine"
  | "neuromuscular medicine"
  | "pediatric rehabilitation medicine"
  | "spinal cord injury medicine"
  | "plastic surgery within the head and neck"
  | "surgery of the hand"
  | "aerospace medicine"
  | "occupational medicine"
  | "preventive medicine/occupational environmental medicine"
  | "public health & general preventive medicine"
  | "addiction psychiatry"
  | "behavioral neurology & neuropsychiatry"
  | "child & adolescent psychiatry"
  | "clinical neurophysiology"
  | "diagnostic neuroimaging"
  | "epilepsy"
  | "forensic psychiatry"
  | "geriatric psychiatry"
  | "neurocritical care"
  | "neurology"
  | "neurology with special qualifications in child neurology"
  | "psychiatry"
  | "psychosomatic medicine"
  | "vascular neurology"
  | "body imaging"
  | "diagnostic radiology"
  | "diagnostic ultrasound"
  | "neuroradiology"
  | "nuclear radiology"
  | "pediatric radiology"
  | "radiation oncology"
  | "radiological physics"
  | "therapeutic radiology"
  | "vascular & interventional radiology"
  | "pediatric surgery"
  | "plastic and reconstructive surgery"
  | "surgical critical care"
  | "surgical oncology"
  | "trauma surgery"
  | "vascular surgery"
  | "pediatric urology"
  | "clinical"
  | "addiction (substance use disorder)"
  | "mental health"
  | "pastoral"
  | "professional"
  | "school"
  | "adult development & aging"
  | "clinical child & adolescent"
  | "cognitive & behavioral"
  | "counseling"
  | "educational"
  | "exercise & sports"
  | "family"
  | "forensic"
  | "group psychotherapy"
  | "health"
  | "health service"
  | "men & masculinity"
  | "intellectual & developmental disabilities"
  | "prescribing (medical)"
  | "psychoanalysis"
  | "psychotherapy"
  | "rehabilitation"
  | "women"
  | "independent medical examiner"
  | "internist"
  | "nutrition"
  | "occupational health"
  | "orthopedic"
  | "pediatric chiropractor"
  | "radiology"
  | "sports physician"
  | "thermography"
  | "dental public health"
  | "dentist anesthesiologist"
  | "endodontics"
  | "general practice"
  | "oral and maxillofacial pathology"
  | "oral and maxillofacial radiology"
  | "oral and maxillofacial surgery"
  | "orofacial pain"
  | "orthodontics and dentofacial orthopedics"
  | "pediatric dentistry"
  | "periodontics"
  | "prosthodontics"
  | "nutrition, gerontological"
  | "nutrition, metabolic"
  | "nutrition, obesity and weight management"
  | "nutrition, oncology"
  | "nutrition, pediatric"
  | "nutrition, pediatric critical care"
  | "nutrition, renal"
  | "nutrition, sports dietetics"
  | "nutrition, education"
  | "corneal and contact management"
  | "low vision rehabilitation"
  | "occupational vision"
  | "pediatrics"
  | "sports vision"
  | "vision therapy"
  | "contact lens"
  | "contact lens fitter"
  | "ocularist"
  | "ophthalmic"
  | "ophthalmic assistant"
  | "optician"
  | "optometric assistant"
  | "optometric technician"
  | "orthoptist"
  | "administrator"
  | "ambulatory care"
  | "cardiac rehabilitation"
  | "case management"
  | "college health"
  | "community health"
  | "continence care"
  | "continuing education/staff development"
  | "diabetes educator"
  | "dialysis, peritoneal"
  | "emergency"
  | "enterostomal therapy"
  | "flight"
  | "gerontology"
  | "hemodialysis"
  | "home health"
  | "hospice"
  | "infection control"
  | "infusion therapy"
  | "lactation consultant"
  | "maternal newborn"
  | "medical-surgical"
  | "neonatal intensive care"
  | "neonatal, low-risk"
  | "neuroscience"
  | "nurse massage therapist (nmt)"
  | "nutrition support"
  | "obstetric, high-risk"
  | "obstetric, inpatient"
  | "oncology"
  | "ostomy care"
  | "otorhinolaryngology & head-neck"
  | "pain management"
  | "pediatric oncology"
  | "perinatal"
  | "plastic surgery"
  | "psychiatric/mental health"
  | "psychiatric/mental health, adult"
  | "psychiatric/mental health, child & adolescent"
  | "registered nurse first assistant"
  | "reproductive endocrinology/infertility"
  | "urology"
  | "womens health care, ambulatory"
  | "wound care"
  | "attendant care provider"
  | "personal care attendant"
  | "home modifications"
  | "vehicle modifications"
  | "independent duty corpsman"
  | "independent duty medical technicians"
  | "graphics designer"
  | "prosthetics case management"
  | "research data abstracter/coder"
  | "research study"
  | "medical research"
  | "cardiology"
  | "compounded sterile preparations"
  | "critical care"
  | "emergency medicine"
  | "geriatric"
  | "infectious diseases"
  | "nuclear"
  | "pharmacist clinician (phc)/ clinical pharmacy specialist"
  | "pharmacotherapy"
  | "psychiatric"
  | "solid organ transplant"
  | "acute care"
  | "adult health"
  | "chronic care"
  | "community health/public health"
  | "ethics"
  | "family health"
  | "holistic"
  | "informatics"
  | "long-term care"
  | "neonatal"
  | "oncology, pediatrics"
  | "perioperative"
  | "psychiatric/mental health, child & family"
  | "psychiatric/mental health, chronically ill"
  | "psychiatric/mental health, community"
  | "psychiatric/mental health, geropsychiatric"
  | "transplantation"
  | "women's health"
  | "neonatal, critical care"
  | "obstetrics & gynecology"
  | "pediatrics, critical care"
  | "primary care"
  | "medical"
  | "surgical"
  | "foot & ankle surgery"
  | "foot surgery"
  | "primary podiatric medicine"
  | "public medicine"
  | "driving and community mobility"
  | "environmental modification"
  | "ergonomics"
  | "feeding, eating & swallowing"
  | "hand"
  | "human factors"
  | "low vision"
  | "neurorehabilitation"
  | "physical rehabilitation"
  | "cardiopulmonary"
  | "electrophysiology, clinical"
  | "geriatrics"
  | "sports"
  | "assistive technology practitioner"
  | "assistive technology supplier"
  | "orientation and mobility training provider"
  | "emergency care"
  | "general care"
  | "geriatric care"
  | "neonatal/pediatrics"
  | "palliative/hospice"
  | "patient transport"
  | "pulmonary diagnostics"
  | "pulmonary function technologist"
  | "pulmonary rehabilitation"
  | "snf/subacute care"
  | "athletic trainer"
  | "rehabilitation, blind"
  | "audiology assistant"
  | "speech-language assistant"
  | "bone densitometry"
  | "cardiac-interventional technology"
  | "cardiovascular-interventional technology"
  | "computed tomography"
  | "magnetic resonance imaging"
  | "mammography"
  | "nuclear medicine technology"
  | "quality management"
  | "radiation therapy"
  | "radiography"
  | "sonography"
  | "vascular sonography"
  | "vascular-interventional technology"
  | "cardiovascular invasive specialist"
  | "vascular specialist"
  | "coding specialist, hospital based"
  | "coding specialist, physician office based"
  | "registered record administrator"
  | "art, medical"
  | "biochemist"
  | "biomedical engineering"
  | "biomedical photographer"
  | "biostatistician"
  | "eeg"
  | "electroneurodiagnostic"
  | "geneticist, medical (phd)"
  | "graphics methods"
  | "illustration, medical"
  | "orthopedic assistant"
  | "surgical assistant"
  | "surgical technologist"
  | "blood banking"
  | "chemistry"
  | "cytotechnology"
  | "hemapheresis practitioner"
  | "histology"
  | "immunology"
  | "laboratory management"
  | "laboratory management, diplomate"
  | "medical technologist"
  | "microbiology"
  | "assistant record technician"
  | "darkroom"
  | "renal dialysis"
  | "veterinary"
  | "clinical laboratory director, non-physician"
  | "medical laboratory"
  | "phlebotomy"
  | "adolescent and children mental health"
  | "adult day care"
  | "adult mental health"
  | "ambulatory family planning facility"
  | "ambulatory fertility facility"
  | "ambulatory surgical"
  | "amputee"
  | "augmentative communication"
  | "birthing"
  | "corporate health"
  | "critical access hospital"
  | "dental"
  | "developmental disabilities"
  | "end-stage renal disease (esrd) treatment"
  | "endoscopy"
  | "family planning, non-surgical"
  | "federally qualified health center (fqhc)"
  | "genetics"
  | "hearing and speech"
  | "lithotripsy"
  | "medical specialty"
  | "medically fragile infants and children day care"
  | "mental health (including community mental health center)"
  | "methadone"
  | "migrant health"
  | "military ambulatory procedure visits operational (transportable)"
  | "military and u.s. coast guard ambulatory procedure"
  | "military outpatient operational (transportable) component"
  | "military/u.s. coast guard outpatient"
  | "multi-specialty"
  | "oncology, radiation"
  | "ophthalmologic surgery"
  | "pain"
  | "physical therapy"
  | "podiatric"
  | "prison health"
  | "public health, federal"
  | "public health, state or local"
  | "radiology, mammography"
  | "radiology, mobile"
  | "radiology, mobile mammography"
  | "recovery care"
  | "rehabilitation, cardiac facilities"
  | "rehabilitation, comprehensive outpatient rehabilitation facility (corf)"
  | "rehabilitation, substance use disorder"
  | "research"
  | "rural health"
  | "sleep disorder diagnostic"
  | "student health"
  | "urgent care"
  | "va"
  | "children"
  | "critical access"
  | "rural"
  | "military general acute care hospital"
  | "military general acute care hospital. operational (transportable)"
  | "assisted living, behavioral disturbances"
  | "assisted living, mental illness"
  | "adult care home"
  | "nursing care, pediatric"
  | "substance abuse treatment, children"
  | "respite care camp"
  | "respite care, mental illness, child"
  | "respite care, intellectual and/or developmental disabilities, child"
  | "respite care, physical disabilities, child"
  | "customized equipment"
  | "dialysis equipment & supplies"
  | "nursing facility supplies"
  | "oxygen equipment & supplies"
  | "parenteral & enteral nutrition"
  | "clinic pharmacy"
  | "community/retail pharmacy"
  | "compounding pharmacy"
  | "home infusion therapy pharmacy"
  | "institutional pharmacy"
  | "long term care pharmacy"
  | "mail order pharmacy"
  | "managed care organization pharmacy"
  | "nuclear pharmacy"
  | "specialty pharmacy"
  | "air transport"
  | "land transport"
  | "water transport"
  | "military or u.s. coast guard ambulance, air transport"
  | "military or u.s. coast guard ambulance, ground transport"
  | "military or u.s. coast guard ambulance, water transport";

const NetworkPhysicianSpecialties = [
  "allergy",
  "clinical & laboratory immunology",
  "addiction medicine",
  "critical care medicine",
  "hospice and palliative medicine",
  "pain medicine",
  "pediatric anesthesiology",
  "clinical & laboratory dermatological immunology",
  "dermatopathology",
  "mohs-micrographic surgery",
  "pediatric dermatology",
  "procedural dermatology",
  "emergency medical services",
  "medical toxicology",
  "pediatric emergency medicine",
  "sports medicine",
  "undersea and hyperbaric medicine",
  "adolescent medicine",
  "adult medicine",
  "geriatric medicine",
  "obesity medicine",
  "sleep medicine",
  "adult congenital heart disease",
  "advanced heart failure and transplant cardiology",
  "allergy & immunology",
  "cardiovascular disease",
  "clinical cardiac electrophysiology",
  "endocrinology, diabetes & metabolism",
  "gastroenterology",
  "hematology",
  "hematology & oncology",
  "hepatology",
  "hypertension specialist",
  "infectious disease",
  "interventional cardiology",
  "magnetic resonance imaging (mri)",
  "medical oncology",
  "nephrology",
  "pulmonary disease",
  "rheumatology",
  "transplant hepatology",
  "clinical biochemical genetics",
  "clinical cytogenetics",
  "clinical genetics (m.d.)",
  "clinical molecular genetics",
  "medical biochemical genetics",
  "molecular genetic pathology",
  "ph.d. medical genetics",
  "in vivo & in vitro nuclear medicine",
  "nuclear cardiology",
  "nuclear imaging & therapy",
  "complex family planning",
  "female pelvic medicine and reconstructive surgery",
  "gynecologic oncology",
  "gynecology",
  "maternal & fetal medicine",
  "obstetrics",
  "reproductive endocrinology",
  "cornea and external diseases specialist",
  "glaucoma specialist",
  "neuro-ophthalmology",
  "ophthalmic plastic and reconstructive surgery",
  "pediatric ophthalmology and strabismus specialist",
  "retina specialist",
  "uveitis and ocular inflammatory disease",
  "adult reconstructive orthopaedic surgery",
  "foot and ankle surgery",
  "hand surgery",
  "orthopaedic surgery of the spine",
  "orthopaedic trauma",
  "pediatric orthopaedic surgery",
  "facial plastic surgery",
  "otolaryngic allergy",
  "otolaryngology/facial plastic surgery",
  "otology & neurotology",
  "pediatric otolaryngology",
  "plastic surgery within the head & neck",
  "interventional pain medicine",
  "anatomic pathology",
  "anatomic pathology & clinical pathology",
  "blood banking & transfusion medicine",
  "chemical pathology",
  "clinical informatics",
  "clinical pathology",
  "clinical pathology/laboratory medicine",
  "cytopathology",
  "forensic pathology",
  "immunopathology",
  "medical microbiology",
  "neuropathology",
  "pediatric pathology",
  "child abuse pediatrics",
  "developmental - behavioral pediatrics",
  "neonatal-perinatal medicine",
  "neurodevelopmental disabilities",
  "pediatric allergy/immunology",
  "pediatric cardiology",
  "pediatric critical care medicine",
  "pediatric endocrinology",
  "pediatric gastroenterology",
  "pediatric hematology-oncology",
  "pediatric infectious diseases",
  "pediatric nephrology",
  "pediatric pulmonology",
  "pediatric rheumatology",
  "pediatric transplant hepatology",
  "brain injury medicine",
  "neuromuscular medicine",
  "pediatric rehabilitation medicine",
  "spinal cord injury medicine",
  "plastic surgery within the head and neck",
  "surgery of the hand",
  "aerospace medicine",
  "occupational medicine",
  "preventive medicine/occupational environmental medicine",
  "public health & general preventive medicine",
  "addiction psychiatry",
  "behavioral neurology & neuropsychiatry",
  "child & adolescent psychiatry",
  "clinical neurophysiology",
  "diagnostic neuroimaging",
  "epilepsy",
  "forensic psychiatry",
  "geriatric psychiatry",
  "neurocritical care",
  "neurology",
  "neurology with special qualifications in child neurology",
  "psychiatry",
  "psychosomatic medicine",
  "vascular neurology",
  "body imaging",
  "diagnostic radiology",
  "diagnostic ultrasound",
  "neuroradiology",
  "nuclear radiology",
  "pediatric radiology",
  "radiation oncology",
  "radiological physics",
  "therapeutic radiology",
  "vascular & interventional radiology",
  "pediatric surgery",
  "plastic and reconstructive surgery",
  "surgical critical care",
  "surgical oncology",
  "trauma surgery",
  "vascular surgery",
  "pediatric urology",
  "clinical",
  "addiction (substance use disorder)",
  "mental health",
  "pastoral",
  "professional",
  "school",
  "adult development & aging",
  "clinical child & adolescent",
  "cognitive & behavioral",
  "counseling",
  "educational",
  "exercise & sports",
  "family",
  "forensic",
  "group psychotherapy",
  "health",
  "health service",
  "men & masculinity",
  "intellectual & developmental disabilities",
  "prescribing (medical)",
  "psychoanalysis",
  "psychotherapy",
  "rehabilitation",
  "women",
  "independent medical examiner",
  "internist",
  "nutrition",
  "occupational health",
  "orthopedic",
  "pediatric chiropractor",
  "radiology",
  "sports physician",
  "thermography",
  "dental public health",
  "dentist anesthesiologist",
  "endodontics",
  "general practice",
  "oral and maxillofacial pathology",
  "oral and maxillofacial radiology",
  "oral and maxillofacial surgery",
  "orofacial pain",
  "orthodontics and dentofacial orthopedics",
  "pediatric dentistry",
  "periodontics",
  "prosthodontics",
  "nutrition, gerontological",
  "nutrition, metabolic",
  "nutrition, obesity and weight management",
  "nutrition, oncology",
  "nutrition, pediatric",
  "nutrition, pediatric critical care",
  "nutrition, renal",
  "nutrition, sports dietetics",
  "nutrition, education",
  "corneal and contact management",
  "low vision rehabilitation",
  "occupational vision",
  "pediatrics",
  "sports vision",
  "vision therapy",
  "contact lens",
  "contact lens fitter",
  "ocularist",
  "ophthalmic",
  "ophthalmic assistant",
  "optician",
  "optometric assistant",
  "optometric technician",
  "orthoptist",
  "administrator",
  "ambulatory care",
  "cardiac rehabilitation",
  "case management",
  "college health",
  "community health",
  "continence care",
  "continuing education/staff development",
  "diabetes educator",
  "dialysis, peritoneal",
  "emergency",
  "enterostomal therapy",
  "flight",
  "gerontology",
  "hemodialysis",
  "home health",
  "hospice",
  "infection control",
  "infusion therapy",
  "lactation consultant",
  "maternal newborn",
  "medical-surgical",
  "neonatal intensive care",
  "neonatal, low-risk",
  "neuroscience",
  "nurse massage therapist (nmt)",
  "nutrition support",
  "obstetric, high-risk",
  "obstetric, inpatient",
  "oncology",
  "ostomy care",
  "otorhinolaryngology & head-neck",
  "pain management",
  "pediatric oncology",
  "perinatal",
  "plastic surgery",
  "psychiatric/mental health",
  "psychiatric/mental health, adult",
  "psychiatric/mental health, child & adolescent",
  "registered nurse first assistant",
  "reproductive endocrinology/infertility",
  "urology",
  "womens health care, ambulatory",
  "wound care",
  "attendant care provider",
  "personal care attendant",
  "home modifications",
  "vehicle modifications",
  "independent duty corpsman",
  "independent duty medical technicians",
  "graphics designer",
  "prosthetics case management",
  "research data abstracter/coder",
  "research study",
  "medical research",
  "cardiology",
  "compounded sterile preparations",
  "critical care",
  "emergency medicine",
  "geriatric",
  "infectious diseases",
  "nuclear",
  "pharmacist clinician (phc)/ clinical pharmacy specialist",
  "pharmacotherapy",
  "psychiatric",
  "solid organ transplant",
  "acute care",
  "adult health",
  "chronic care",
  "community health/public health",
  "ethics",
  "family health",
  "holistic",
  "informatics",
  "long-term care",
  "neonatal",
  "oncology, pediatrics",
  "perioperative",
  "psychiatric/mental health, child & family",
  "psychiatric/mental health, chronically ill",
  "psychiatric/mental health, community",
  "psychiatric/mental health, geropsychiatric",
  "transplantation",
  "women's health",
  "neonatal, critical care",
  "obstetrics & gynecology",
  "pediatrics, critical care",
  "primary care",
  "medical",
  "surgical",
  "foot & ankle surgery",
  "foot surgery",
  "primary podiatric medicine",
  "public medicine",
  "driving and community mobility",
  "environmental modification",
  "ergonomics",
  "feeding, eating & swallowing",
  "hand",
  "human factors",
  "low vision",
  "neurorehabilitation",
  "physical rehabilitation",
  "cardiopulmonary",
  "electrophysiology, clinical",
  "geriatrics",
  "sports",
  "assistive technology practitioner",
  "assistive technology supplier",
  "orientation and mobility training provider",
  "emergency care",
  "general care",
  "geriatric care",
  "neonatal/pediatrics",
  "palliative/hospice",
  "patient transport",
  "pulmonary diagnostics",
  "pulmonary function technologist",
  "pulmonary rehabilitation",
  "snf/subacute care",
  "athletic trainer",
  "rehabilitation, blind",
  "audiology assistant",
  "speech-language assistant",
  "bone densitometry",
  "cardiac-interventional technology",
  "cardiovascular-interventional technology",
  "computed tomography",
  "magnetic resonance imaging",
  "mammography",
  "nuclear medicine technology",
  "quality management",
  "radiation therapy",
  "radiography",
  "sonography",
  "vascular sonography",
  "vascular-interventional technology",
  "cardiovascular invasive specialist",
  "vascular specialist",
  "coding specialist, hospital based",
  "coding specialist, physician office based",
  "registered record administrator",
  "art, medical",
  "biochemist",
  "biomedical engineering",
  "biomedical photographer",
  "biostatistician",
  "eeg",
  "electroneurodiagnostic",
  "geneticist, medical (phd)",
  "graphics methods",
  "illustration, medical",
  "orthopedic assistant",
  "surgical assistant",
  "surgical technologist",
  "blood banking",
  "chemistry",
  "cytotechnology",
  "hemapheresis practitioner",
  "histology",
  "immunology",
  "laboratory management",
  "laboratory management, diplomate",
  "medical technologist",
  "microbiology",
  "assistant record technician",
  "darkroom",
  "renal dialysis",
  "veterinary",
  "clinical laboratory director, non-physician",
  "medical laboratory",
  "phlebotomy",
  "adolescent and children mental health",
  "adult day care",
  "adult mental health",
  "ambulatory family planning facility",
  "ambulatory fertility facility",
  "ambulatory surgical",
  "amputee",
  "augmentative communication",
  "birthing",
  "corporate health",
  "critical access hospital",
  "dental",
  "developmental disabilities",
  "end-stage renal disease (esrd) treatment",
  "endoscopy",
  "family planning, non-surgical",
  "federally qualified health center (fqhc)",
  "genetics",
  "hearing and speech",
  "lithotripsy",
  "medical specialty",
  "medically fragile infants and children day care",
  "mental health (including community mental health center)",
  "methadone",
  "migrant health",
  "military ambulatory procedure visits operational (transportable)",
  "military and u.s. coast guard ambulatory procedure",
  "military outpatient operational (transportable) component",
  "military/u.s. coast guard outpatient",
  "multi-specialty",
  "oncology, radiation",
  "ophthalmologic surgery",
  "pain",
  "physical therapy",
  "podiatric",
  "prison health",
  "public health, federal",
  "public health, state or local",
  "radiology, mammography",
  "radiology, mobile",
  "radiology, mobile mammography",
  "recovery care",
  "rehabilitation, cardiac facilities",
  "rehabilitation, comprehensive outpatient rehabilitation facility (corf)",
  "rehabilitation, substance use disorder",
  "research",
  "rural health",
  "sleep disorder diagnostic",
  "student health",
  "urgent care",
  "va",
  "children",
  "critical access",
  "rural",
  "military general acute care hospital",
  "military general acute care hospital. operational (transportable)",
  "assisted living, behavioral disturbances",
  "assisted living, mental illness",
  "adult care home",
  "nursing care, pediatric",
  "substance abuse treatment, children",
  "respite care camp",
  "respite care, mental illness, child",
  "respite care, intellectual and/or developmental disabilities, child",
  "respite care, physical disabilities, child",
  "customized equipment",
  "dialysis equipment & supplies",
  "nursing facility supplies",
  "oxygen equipment & supplies",
  "parenteral & enteral nutrition",
  "clinic pharmacy",
  "community/retail pharmacy",
  "compounding pharmacy",
  "home infusion therapy pharmacy",
  "institutional pharmacy",
  "long term care pharmacy",
  "mail order pharmacy",
  "managed care organization pharmacy",
  "nuclear pharmacy",
  "specialty pharmacy",
  "air transport",
  "land transport",
  "water transport",
  "military or u.s. coast guard ambulance, air transport",
  "military or u.s. coast guard ambulance, ground transport",
  "military or u.s. coast guard ambulance, water transport",
] as const;

const NetworkPhysicianSpecialtyEnum = z.enum(NetworkPhysicianSpecialties);

const NetworkPhysicianSpecialtyLabels = {
  allergy: "Allergy",
  "clinical & laboratory immunology": "Clinical & Laboratory Immunology",
  "addiction medicine": "Addiction Medicine",
  "critical care medicine": "Critical Care Medicine",
  "hospice and palliative medicine": "Hospice and Palliative Medicine",
  "pain medicine": "Pain Medicine",
  "pediatric anesthesiology": "Pediatric Anesthesiology",
  "clinical & laboratory dermatological immunology":
    "Clinical & Laboratory Dermatological Immunology",
  dermatopathology: "Dermatopathology",
  "mohs-micrographic surgery": "MOHS-Micrographic Surgery",
  "pediatric dermatology": "Pediatric Dermatology",
  "procedural dermatology": "Procedural Dermatology",
  "emergency medical services": "Emergency Medical Services",
  "medical toxicology": "Medical Toxicology",
  "pediatric emergency medicine": "Pediatric Emergency Medicine",
  "sports medicine": "Sports Medicine",
  "undersea and hyperbaric medicine": "Undersea and Hyperbaric Medicine",
  "adolescent medicine": "Adolescent Medicine",
  "adult medicine": "Adult Medicine",
  "geriatric medicine": "Geriatric Medicine",
  "obesity medicine": "Obesity Medicine",
  "sleep medicine": "Sleep Medicine",
  "adult congenital heart disease": "Adult Congenital Heart Disease",
  "advanced heart failure and transplant cardiology":
    "Advanced Heart Failure and Transplant Cardiology",
  "allergy & immunology": "Allergy & Immunology",
  "cardiovascular disease": "Cardiovascular Disease",
  "clinical cardiac electrophysiology": "Clinical Cardiac Electrophysiology",
  "endocrinology, diabetes & metabolism":
    "Endocrinology, Diabetes & Metabolism",
  gastroenterology: "Gastroenterology",
  hematology: "Hematology",
  "hematology & oncology": "Hematology & Oncology",
  hepatology: "Hepatology",
  "hypertension specialist": "Hypertension Specialist",
  "infectious disease": "Infectious Disease",
  "interventional cardiology": "Interventional Cardiology",
  "magnetic resonance imaging (mri)": "Magnetic Resonance Imaging (MRI)",
  "medical oncology": "Medical Oncology",
  nephrology: "Nephrology",
  "pulmonary disease": "Pulmonary Disease",
  rheumatology: "Rheumatology",
  "transplant hepatology": "Transplant Hepatology",
  "clinical biochemical genetics": "Clinical Biochemical Genetics",
  "clinical cytogenetics": "Clinical Cytogenetics",
  "clinical genetics (m.d.)": "Clinical Genetics (M.D.)",
  "clinical molecular genetics": "Clinical Molecular Genetics",
  "medical biochemical genetics": "Medical Biochemical Genetics",
  "molecular genetic pathology": "Molecular Genetic Pathology",
  "ph.d. medical genetics": "Ph.D. Medical Genetics",
  "in vivo & in vitro nuclear medicine": "In Vivo & In Vitro Nuclear Medicine",
  "nuclear cardiology": "Nuclear Cardiology",
  "nuclear imaging & therapy": "Nuclear Imaging & Therapy",
  "complex family planning": "Complex Family Planning",
  "female pelvic medicine and reconstructive surgery":
    "Female Pelvic Medicine and Reconstructive Surgery",
  "gynecologic oncology": "Gynecologic Oncology",
  gynecology: "Gynecology",
  "maternal & fetal medicine": "Maternal & Fetal Medicine",
  obstetrics: "Obstetrics",
  "reproductive endocrinology": "Reproductive Endocrinology",
  "cornea and external diseases specialist":
    "Cornea and External Diseases Specialist",
  "glaucoma specialist": "Glaucoma Specialist",
  "neuro-ophthalmology": "Neuro-ophthalmology",
  "ophthalmic plastic and reconstructive surgery":
    "Ophthalmic Plastic and Reconstructive Surgery",
  "pediatric ophthalmology and strabismus specialist":
    "Pediatric Ophthalmology and Strabismus Specialist",
  "retina specialist": "Retina Specialist",
  "uveitis and ocular inflammatory disease":
    "Uveitis and Ocular Inflammatory Disease",
  "adult reconstructive orthopaedic surgery":
    "Adult Reconstructive Orthopaedic Surgery",
  "foot and ankle surgery": "Foot and Ankle Surgery",
  "hand surgery": "Hand Surgery",
  "orthopaedic surgery of the spine": "Orthopaedic Surgery of the Spine",
  "orthopaedic trauma": "Orthopaedic Trauma",
  "pediatric orthopaedic surgery": "Pediatric Orthopaedic Surgery",
  "facial plastic surgery": "Facial Plastic Surgery",
  "otolaryngic allergy": "Otolaryngic Allergy",
  "otolaryngology/facial plastic surgery":
    "Otolaryngology/Facial Plastic Surgery",
  "otology & neurotology": "Otology & Neurotology",
  "pediatric otolaryngology": "Pediatric Otolaryngology",
  "plastic surgery within the head & neck":
    "Plastic Surgery within the Head & Neck",
  "interventional pain medicine": "Interventional Pain Medicine",
  "anatomic pathology": "Anatomic Pathology",
  "anatomic pathology & clinical pathology":
    "Anatomic Pathology & Clinical Pathology",
  "blood banking & transfusion medicine":
    "Blood Banking & Transfusion Medicine",
  "chemical pathology": "Chemical Pathology",
  "clinical informatics": "Clinical Informatics",
  "clinical pathology": "Clinical Pathology",
  "clinical pathology/laboratory medicine":
    "Clinical Pathology/Laboratory Medicine",
  cytopathology: "Cytopathology",
  "forensic pathology": "Forensic Pathology",
  immunopathology: "Immunopathology",
  "medical microbiology": "Medical Microbiology",
  neuropathology: "Neuropathology",
  "pediatric pathology": "Pediatric Pathology",
  "child abuse pediatrics": "Child Abuse Pediatrics",
  "developmental - behavioral pediatrics":
    "Developmental - Behavioral Pediatrics",
  "neonatal-perinatal medicine": "Neonatal-Perinatal Medicine",
  "neurodevelopmental disabilities": "Neurodevelopmental Disabilities",
  "pediatric allergy/immunology": "Pediatric Allergy/Immunology",
  "pediatric cardiology": "Pediatric Cardiology",
  "pediatric critical care medicine": "Pediatric Critical Care Medicine",
  "pediatric endocrinology": "Pediatric Endocrinology",
  "pediatric gastroenterology": "Pediatric Gastroenterology",
  "pediatric hematology-oncology": "Pediatric Hematology-Oncology",
  "pediatric infectious diseases": "Pediatric Infectious Diseases",
  "pediatric nephrology": "Pediatric Nephrology",
  "pediatric pulmonology": "Pediatric Pulmonology",
  "pediatric rheumatology": "Pediatric Rheumatology",
  "pediatric transplant hepatology": "Pediatric Transplant Hepatology",
  "brain injury medicine": "Brain Injury Medicine",
  "neuromuscular medicine": "Neuromuscular Medicine",
  "pediatric rehabilitation medicine": "Pediatric Rehabilitation Medicine",
  "spinal cord injury medicine": "Spinal Cord Injury Medicine",
  "plastic surgery within the head and neck":
    "Plastic Surgery Within the Head and Neck",
  "surgery of the hand": "Surgery of the Hand",
  "aerospace medicine": "Aerospace Medicine",
  "occupational medicine": "Occupational Medicine",
  "preventive medicine/occupational environmental medicine":
    "Preventive Medicine/Occupational Environmental Medicine",
  "public health & general preventive medicine":
    "Public Health & General Preventive Medicine",
  "addiction psychiatry": "Addiction Psychiatry",
  "behavioral neurology & neuropsychiatry":
    "Behavioral Neurology & Neuropsychiatry",
  "child & adolescent psychiatry": "Child & Adolescent Psychiatry",
  "clinical neurophysiology": "Clinical Neurophysiology",
  "diagnostic neuroimaging": "Diagnostic Neuroimaging",
  epilepsy: "Epilepsy",
  "forensic psychiatry": "Forensic Psychiatry",
  "geriatric psychiatry": "Geriatric Psychiatry",
  "neurocritical care": "Neurocritical Care",
  neurology: "Neurology",
  "neurology with special qualifications in child neurology":
    "Neurology with Special Qualifications in Child Neurology",
  psychiatry: "Psychiatry",
  "psychosomatic medicine": "Psychosomatic Medicine",
  "vascular neurology": "Vascular Neurology",
  "body imaging": "Body Imaging",
  "diagnostic radiology": "Diagnostic Radiology",
  "diagnostic ultrasound": "Diagnostic Ultrasound",
  neuroradiology: "Neuroradiology",
  "nuclear radiology": "Nuclear Radiology",
  "pediatric radiology": "Pediatric Radiology",
  "radiation oncology": "Radiation Oncology",
  "radiological physics": "Radiological Physics",
  "therapeutic radiology": "Therapeutic Radiology",
  "vascular & interventional radiology": "Vascular & Interventional Radiology",
  "pediatric surgery": "Pediatric Surgery",
  "plastic and reconstructive surgery": "Plastic and Reconstructive Surgery",
  "surgical critical care": "Surgical Critical Care",
  "surgical oncology": "Surgical Oncology",
  "trauma surgery": "Trauma Surgery",
  "vascular surgery": "Vascular Surgery",
  "pediatric urology": "Pediatric Urology",
  clinical: "Clinical",
  "addiction (substance use disorder)": "Addiction (Substance Use Disorder)",
  "mental health": "Mental Health",
  pastoral: "Pastoral",
  professional: "Professional",
  school: "School",
  "adult development & aging": "Adult Development & Aging",
  "clinical child & adolescent": "Clinical Child & Adolescent",
  "cognitive & behavioral": "Cognitive & Behavioral",
  counseling: "Counseling",
  educational: "Educational",
  "exercise & sports": "Exercise & Sports",
  family: "Family",
  forensic: "Forensic",
  "group psychotherapy": "Group Psychotherapy",
  health: "Health",
  "health service": "Health Service",
  "men & masculinity": "Men & Masculinity",
  "intellectual & developmental disabilities":
    "Intellectual & Developmental Disabilities",
  "prescribing (medical)": "Prescribing (Medical)",
  psychoanalysis: "Psychoanalysis",
  psychotherapy: "Psychotherapy",
  rehabilitation: "Rehabilitation",
  women: "Women",
  "independent medical examiner": "Independent Medical Examiner",
  internist: "Internist",
  nutrition: "Nutrition",
  "occupational health": "Occupational Health",
  orthopedic: "Orthopedic",
  "pediatric chiropractor": "Pediatric Chiropractor",
  radiology: "Radiology",
  "sports physician": "Sports NetworkPhysician",
  thermography: "Thermography",
  "dental public health": "Dental Public Health",
  "dentist anesthesiologist": "Dentist Anesthesiologist",
  endodontics: "Endodontics",
  "general practice": "General Practice",
  "oral and maxillofacial pathology": "Oral and Maxillofacial Pathology",
  "oral and maxillofacial radiology": "Oral and Maxillofacial Radiology",
  "oral and maxillofacial surgery": "Oral and Maxillofacial Surgery",
  "orofacial pain": "Orofacial Pain",
  "orthodontics and dentofacial orthopedics":
    "Orthodontics and Dentofacial Orthopedics",
  "pediatric dentistry": "Pediatric Dentistry",
  periodontics: "Periodontics",
  prosthodontics: "Prosthodontics",
  "nutrition, gerontological": "Nutrition, Gerontological",
  "nutrition, metabolic": "Nutrition, Metabolic",
  "nutrition, obesity and weight management":
    "Nutrition, Obesity and Weight Management",
  "nutrition, oncology": "Nutrition, Oncology",
  "nutrition, pediatric": "Nutrition, Pediatric",
  "nutrition, pediatric critical care": "Nutrition, Pediatric Critical Care",
  "nutrition, renal": "Nutrition, Renal",
  "nutrition, sports dietetics": "Nutrition, Sports Dietetics",
  "nutrition, education": "Nutrition, Education",
  "corneal and contact management": "Corneal and Contact Management",
  "low vision rehabilitation": "Low Vision Rehabilitation",
  "occupational vision": "Occupational Vision",
  pediatrics: "Pediatrics",
  "sports vision": "Sports Vision",
  "vision therapy": "Vision Therapy",
  "contact lens": "Contact Lens",
  "contact lens fitter": "Contact Lens Fitter",
  ocularist: "Ocularist",
  ophthalmic: "Ophthalmic",
  "ophthalmic assistant": "Ophthalmic Assistant",
  optician: "Optician",
  "optometric assistant": "Optometric Assistant",
  "optometric technician": "Optometric Technician",
  orthoptist: "Orthoptist",
  administrator: "Administrator",
  "ambulatory care": "Ambulatory Care",
  "cardiac rehabilitation": "Cardiac Rehabilitation",
  "case management": "Case Management",
  "college health": "College Health",
  "community health": "Community Health",
  "continence care": "Continence Care",
  "continuing education/staff development":
    "Continuing Education/Staff Development",
  "diabetes educator": "Diabetes Educator",
  "dialysis, peritoneal": "Dialysis, Peritoneal",
  emergency: "Emergency",
  "enterostomal therapy": "Enterostomal Therapy",
  flight: "Flight",
  gerontology: "Gerontology",
  hemodialysis: "Hemodialysis",
  "home health": "Home Health",
  hospice: "Hospice",
  "infection control": "Infection Control",
  "infusion therapy": "Infusion Therapy",
  "lactation consultant": "Lactation Consultant",
  "maternal newborn": "Maternal Newborn",
  "medical-surgical": "Medical-Surgical",
  "neonatal intensive care": "Neonatal Intensive Care",
  "neonatal, low-risk": "Neonatal, Low-Risk",
  neuroscience: "Neuroscience",
  "nurse massage therapist (nmt)": "Nurse Massage Therapist (NMT)",
  "nutrition support": "Nutrition Support",
  "obstetric, high-risk": "Obstetric, High-Risk",
  "obstetric, inpatient": "Obstetric, Inpatient",
  oncology: "Oncology",
  "ostomy care": "Ostomy Care",
  "otorhinolaryngology & head-neck": "Otorhinolaryngology & Head-Neck",
  "pain management": "Pain Management",
  "pediatric oncology": "Pediatric Oncology",
  perinatal: "Perinatal",
  "plastic surgery": "Plastic Surgery",
  "psychiatric/mental health": "Psychiatric/Mental Health",
  "psychiatric/mental health, adult": "Psychiatric/Mental Health, Adult",
  "psychiatric/mental health, child & adolescent":
    "Psychiatric/Mental Health, Child & Adolescent",
  "registered nurse first assistant": "Registered Nurse First Assistant",
  "reproductive endocrinology/infertility":
    "Reproductive Endocrinology/Infertility",
  urology: "Urology",
  "womens health care, ambulatory": "Womens Health Care, Ambulatory",
  "wound care": "Wound Care",
  "attendant care provider": "Attendant Care Provider",
  "personal care attendant": "Personal Care Attendant",
  "home modifications": "Home Modifications",
  "vehicle modifications": "Vehicle Modifications",
  "independent duty corpsman": "Independent Duty Corpsman",
  "independent duty medical technicians":
    "Independent Duty Medical Technicians",
  "graphics designer": "Graphics Designer",
  "prosthetics case management": "Prosthetics Case Management",
  "research data abstracter/coder": "Research Data Abstracter/Coder",
  "research study": "Research Study",
  "medical research": "Medical Research",
  cardiology: "Cardiology",
  "compounded sterile preparations": "Compounded Sterile Preparations",
  "critical care": "Critical Care",
  "emergency medicine": "Emergency Medicine",
  geriatric: "Geriatric",
  "infectious diseases": "Infectious Diseases",
  nuclear: "Nuclear",
  "pharmacist clinician (phc)/ clinical pharmacy specialist":
    "Pharmacist Clinician (PhC)/ Clinical Pharmacy Specialist",
  pharmacotherapy: "Pharmacotherapy",
  psychiatric: "Psychiatric",
  "solid organ transplant": "Solid Organ Transplant",
  "acute care": "Acute Care",
  "adult health": "Adult Health",
  "chronic care": "Chronic Care",
  "community health/public health": "Community Health/Public Health",
  ethics: "Ethics",
  "family health": "Family Health",
  holistic: "Holistic",
  informatics: "Informatics",
  "long-term care": "Long-Term Care",
  neonatal: "Neonatal",
  "oncology, pediatrics": "Oncology, Pediatrics",
  perioperative: "Perioperative",
  "psychiatric/mental health, child & family":
    "Psychiatric/Mental Health, Child & Family",
  "psychiatric/mental health, chronically ill":
    "Psychiatric/Mental Health, Chronically Ill",
  "psychiatric/mental health, community":
    "Psychiatric/Mental Health, Community",
  "psychiatric/mental health, geropsychiatric":
    "Psychiatric/Mental Health, Geropsychiatric",
  transplantation: "Transplantation",
  "women's health": "Women's Health",
  "neonatal, critical care": "Neonatal, Critical Care",
  "obstetrics & gynecology": "Obstetrics & Gynecology",
  "pediatrics, critical care": "Pediatrics, Critical Care",
  "primary care": "Primary Care",
  medical: "Medical",
  surgical: "Surgical",
  "foot & ankle surgery": "Foot & Ankle Surgery",
  "foot surgery": "Foot Surgery",
  "primary podiatric medicine": "Primary Podiatric Medicine",
  "public medicine": "Public Medicine",
  "driving and community mobility": "Driving and Community Mobility",
  "environmental modification": "Environmental Modification",
  ergonomics: "Ergonomics",
  "feeding, eating & swallowing": "Feeding, Eating & Swallowing",
  hand: "Hand",
  "human factors": "Human Factors",
  "low vision": "Low Vision",
  neurorehabilitation: "Neurorehabilitation",
  "physical rehabilitation": "Physical Rehabilitation",
  cardiopulmonary: "Cardiopulmonary",
  "electrophysiology, clinical": "Electrophysiology, Clinical",
  geriatrics: "Geriatrics",
  sports: "Sports",
  "assistive technology practitioner": "Assistive Technology Practitioner",
  "assistive technology supplier": "Assistive Technology Supplier",
  "orientation and mobility training provider":
    "Orientation and Mobility Training Provider",
  "emergency care": "Emergency Care",
  "general care": "General Care",
  "geriatric care": "Geriatric Care",
  "neonatal/pediatrics": "Neonatal/Pediatrics",
  "palliative/hospice": "Palliative/Hospice",
  "patient transport": "Patient Transport",
  "pulmonary diagnostics": "Pulmonary Diagnostics",
  "pulmonary function technologist": "Pulmonary Function Technologist",
  "pulmonary rehabilitation": "Pulmonary Rehabilitation",
  "snf/subacute care": "SNF/Subacute Care",
  "athletic trainer": "Athletic Trainer",
  "rehabilitation, blind": "Rehabilitation, Blind",
  "audiology assistant": "Audiology Assistant",
  "speech-language assistant": "Speech-Language Assistant",
  "bone densitometry": "Bone Densitometry",
  "cardiac-interventional technology": "Cardiac-Interventional Technology",
  "cardiovascular-interventional technology":
    "Cardiovascular-Interventional Technology",
  "computed tomography": "Computed Tomography",
  "magnetic resonance imaging": "Magnetic Resonance Imaging",
  mammography: "Mammography",
  "nuclear medicine technology": "Nuclear Medicine Technology",
  "quality management": "Quality Management",
  "radiation therapy": "Radiation Therapy",
  radiography: "Radiography",
  sonography: "Sonography",
  "vascular sonography": "Vascular Sonography",
  "vascular-interventional technology": "Vascular-Interventional Technology",
  "cardiovascular invasive specialist": "Cardiovascular Invasive Specialist",
  "vascular specialist": "Vascular Specialist",
  "coding specialist, hospital based": "Coding Specialist, Hospital Based",
  "coding specialist, physician office based":
    "Coding Specialist, NetworkPhysician Office Based",
  "registered record administrator": "Registered Record Administrator",
  "art, medical": "Art, Medical",
  biochemist: "Biochemist",
  "biomedical engineering": "Biomedical Engineering",
  "biomedical photographer": "Biomedical Photographer",
  biostatistician: "Biostatistician",
  eeg: "EEG",
  electroneurodiagnostic: "Electroneurodiagnostic",
  "geneticist, medical (phd)": "Geneticist, Medical (PhD)",
  "graphics methods": "Graphics Methods",
  "illustration, medical": "Illustration, Medical",
  "orthopedic assistant": "Orthopedic Assistant",
  "surgical assistant": "Surgical Assistant",
  "surgical technologist": "Surgical Technologist",
  "blood banking": "Blood Banking",
  chemistry: "Chemistry",
  cytotechnology: "Cytotechnology",
  "hemapheresis practitioner": "Hemapheresis Practitioner",
  histology: "Histology",
  immunology: "Immunology",
  "laboratory management": "Laboratory Management",
  "laboratory management, diplomate": "Laboratory Management, Diplomate",
  "medical technologist": "Medical Technologist",
  microbiology: "Microbiology",
  "assistant record technician": "Assistant Record Technician",
  darkroom: "Darkroom",
  "renal dialysis": "Renal Dialysis",
  veterinary: "Veterinary",
  "clinical laboratory director, non-physician":
    "Clinical Laboratory Director, Non-physician",
  "medical laboratory": "Medical Laboratory",
  phlebotomy: "Phlebotomy",
  "adolescent and children mental health":
    "Adolescent and Children Mental Health",
  "adult day care": "Adult Day Care",
  "adult mental health": "Adult Mental Health",
  "ambulatory family planning facility": "Ambulatory Family Planning Facility",
  "ambulatory fertility facility": "Ambulatory Fertility Facility",
  "ambulatory surgical": "Ambulatory Surgical",
  amputee: "Amputee",
  "augmentative communication": "Augmentative Communication",
  birthing: "Birthing",
  "corporate health": "Corporate Health",
  "critical access hospital": "Critical Access Hospital",
  dental: "Dental",
  "developmental disabilities": "Developmental Disabilities",
  "end-stage renal disease (esrd) treatment":
    "End-Stage Renal Disease (ESRD) Treatment",
  endoscopy: "Endoscopy",
  "family planning, non-surgical": "Family Planning, Non-Surgical",
  "federally qualified health center (fqhc)":
    "Federally Qualified Health Center (FQHC)",
  genetics: "Genetics",
  "hearing and speech": "Hearing and Speech",
  lithotripsy: "Lithotripsy",
  "medical specialty": "Medical Specialty",
  "medically fragile infants and children day care":
    "Medically Fragile Infants and Children Day Care",
  "mental health (including community mental health center)":
    "Mental Health (Including Community Mental Health Center)",
  methadone: "Methadone",
  "migrant health": "Migrant Health",
  "military ambulatory procedure visits operational (transportable)":
    "Military Ambulatory Procedure Visits Operational (Transportable)",
  "military and u.s. coast guard ambulatory procedure":
    "Military and U.S. Coast Guard Ambulatory Procedure",
  "military outpatient operational (transportable) component":
    "Military Outpatient Operational (Transportable) Component",
  "military/u.s. coast guard outpatient":
    "Military/U.S. Coast Guard Outpatient",
  "multi-specialty": "Multi-Specialty",
  "oncology, radiation": "Oncology, Radiation",
  "ophthalmologic surgery": "Ophthalmologic Surgery",
  pain: "Pain",
  "physical therapy": "Physical Therapy",
  podiatric: "Podiatric",
  "prison health": "Prison Health",
  "public health, federal": "Public Health, Federal",
  "public health, state or local": "Public Health, State or Local",
  "radiology, mammography": "Radiology, Mammography",
  "radiology, mobile": "Radiology, Mobile",
  "radiology, mobile mammography": "Radiology, Mobile Mammography",
  "recovery care": "Recovery Care",
  "rehabilitation, cardiac facilities": "Rehabilitation, Cardiac Facilities",
  "rehabilitation, comprehensive outpatient rehabilitation facility (corf)":
    "Rehabilitation, Comprehensive Outpatient Rehabilitation Facility (CORF)",
  "rehabilitation, substance use disorder":
    "Rehabilitation, Substance Use Disorder",
  research: "Research",
  "rural health": "Rural Health",
  "sleep disorder diagnostic": "Sleep Disorder Diagnostic",
  "student health": "Student Health",
  "urgent care": "Urgent Care",
  va: "VA",
  children: "Children",
  "critical access": "Critical Access",
  rural: "Rural",
  "military general acute care hospital":
    "Military General Acute Care Hospital",
  "military general acute care hospital. operational (transportable)":
    "Military General Acute Care Hospital. Operational (Transportable)",
  "assisted living, behavioral disturbances":
    "Assisted Living, Behavioral Disturbances",
  "assisted living, mental illness": "Assisted Living, Mental Illness",
  "adult care home": "Adult Care Home",
  "nursing care, pediatric": "Nursing Care, Pediatric",
  "substance abuse treatment, children": "Substance Abuse Treatment, Children",
  "respite care camp": "Respite Care Camp",
  "respite care, mental illness, child": "Respite Care, Mental Illness, Child",
  "respite care, intellectual and/or developmental disabilities, child":
    "Respite Care, Intellectual and/or Developmental Disabilities, Child",
  "respite care, physical disabilities, child":
    "Respite Care, Physical Disabilities, Child",
  "customized equipment": "Customized Equipment",
  "dialysis equipment & supplies": "Dialysis Equipment & Supplies",
  "nursing facility supplies": "Nursing Facility Supplies",
  "oxygen equipment & supplies": "Oxygen Equipment & Supplies",
  "parenteral & enteral nutrition": "Parenteral & Enteral Nutrition",
  "clinic pharmacy": "Clinic Pharmacy",
  "community/retail pharmacy": "Community/Retail Pharmacy",
  "compounding pharmacy": "Compounding Pharmacy",
  "home infusion therapy pharmacy": "Home Infusion Therapy Pharmacy",
  "institutional pharmacy": "Institutional Pharmacy",
  "long term care pharmacy": "Long Term Care Pharmacy",
  "mail order pharmacy": "Mail Order Pharmacy",
  "managed care organization pharmacy": "Managed Care Organization Pharmacy",
  "nuclear pharmacy": "Nuclear Pharmacy",
  "specialty pharmacy": "Specialty Pharmacy",
  "air transport": "Air Transport",
  "land transport": "Land Transport",
  "water transport": "Water Transport",
  "military or u.s. coast guard ambulance, air transport":
    "Military or U.S. Coast Guard Ambulance, Air Transport",
  "military or u.s. coast guard ambulance, ground transport":
    "Military or U.S. Coast Guard Ambulance, Ground Transport",
  "military or u.s. coast guard ambulance, water transport":
    "Military or U.S. Coast Guard Ambulance, Water Transport",
};

export {
  type NetworkPhysicianSpecialty,
  NetworkPhysicianSpecialties,
  NetworkPhysicianSpecialtyEnum,
  NetworkPhysicianSpecialtyLabels,
};
