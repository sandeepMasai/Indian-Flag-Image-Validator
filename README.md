# 🇮🇳 Indian Flag Image Validator – Independence Day Coding Challenge

This project is an **automated image validator** that checks whether a given Indian flag image (PNG, JPG, or SVG) complies with the **Bureau of Indian Standards (BIS)** specifications.

---

## 📌 Objective

Given a flag image, validate the following BIS rules:
- ✅ Aspect Ratio (3:2 ±1%)
- ✅ Color Accuracy (Saffron, White, Green, Chakra Blue within ±5% RGB tolerance)
- ✅ Stripe Proportions (Each band should be exactly 1/3 of height)
- ✅ Ashoka Chakra:
  - Diameter = 3/4 of the white band
  - Centered in the white band
  - Exactly **24 spokes**

---

## 📥 Input

- An image file of the Indian flag: `.png`, `.jpg`, `.jpeg`, or `.svg`
- Max size: **5MB**
- Only flat, solid-color images (no folds or gradients)

---

## 📤 Output

A detailed **JSON report** with pass/fail results for each validation check.

### ✅ Example Output:

```json
{
  "aspect_ratio": { "status": "fail", "actual": "1.52" },
  "colors": {
    "saffron": { "status": "pass", "deviation": "3%" },
    "white": { "status": "fail", "deviation": "12%" },
    "green": { "status": "pass", "deviation": "2%" },
    "chakra_blue": { "status": "pass", "deviation": "1%" }
  },
  "stripe_proportion": {
    "status": "fail",
    "top": "0.35",
    "middle": "0.33",
    "bottom": "0.32"
  },
  "chakra_position": {
    "status": "pass",
    "offset_x": "0px",
    "offset_y": "0px"
  },
  "chakra_spokes": {
    "status": "fail",
    "detected": 22
  },
  "processing_time": 1.93,
  "passed_checks": 4,
  "total_checks": 6,
  "overall_status": "fail"
}
🧠 Tech Stack
Frontend: React + Tailwind CSS (UI for uploads and reports)




🧪 Validation Criteria
Criteria	Requirement
Aspect Ratio	3:2 ± 1% tolerance
Colors	Saffron (#FF9933), White (#FFFFFF), Green (#138808), Chakra Blue (#000080) ±5%
Stripe Proportion	Top, Middle, Bottom = 33.3% each
Chakra Specs	Centered, 24 spokes, 75% white band height
