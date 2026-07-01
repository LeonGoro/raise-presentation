from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

width, height = letter

# Create PDF
c = canvas.Canvas("/sessions/bold-elegant-curie/mnt/leontrade/raise-presentation/RAISE_Design_Master.pdf", pagesize=letter)

# BACKGROUND - Deep navy
c.setFillColor(colors.HexColor("#0F172A"))
c.rect(0, 0, width, height, fill=1, stroke=0)

# COLOR ZONES - Ascending progression
# Zone 1: Deep foundation (0-25%)
c.setFillColor(colors.HexColor("#1E293B"))
c.rect(0, 0, width, height * 0.25, fill=1, stroke=0)

# Zone 2: Transitional (25-50%)
c.setFillColor(colors.HexColor("#334155"))
c.rect(0, height * 0.25, width, height * 0.25, fill=1, stroke=0)

# Zone 3: Light transition (50-75%)
c.setFillColor(colors.HexColor("#CBD5E1"))
c.rect(0, height * 0.5, width, height * 0.25, fill=1, stroke=0)

# Zone 4: Bright ascendant (75-100%)
c.setFillColor(colors.HexColor("#F8FAFC"))
c.rect(0, height * 0.75, width, height * 0.25, fill=1, stroke=0)

# GEOMETRIC VECTORS - Ascending lines
# Cyan vector 1
c.setStrokeColor(colors.HexColor("#06B6D4"))
c.setLineWidth(3)
c.line(width * 0.1, height * 0.2, width * 0.4, height * 0.65)

# Gold vector 2
c.setStrokeColor(colors.HexColor("#FBBF24"))
c.setLineWidth(2.5)
c.line(width * 0.25, height * 0.35, width * 0.75, height * 0.85)

# Bright cyan vector 3 (top accent)
c.setStrokeColor(colors.HexColor("#06B6D4"))
c.setLineWidth(5)
c.line(width * 0.15, height * 0.78, width * 0.9, height * 0.95)

# ACCENT SHAPES
# Ascending triangle using path
p = c.beginPath()
p.moveTo(width * 0.05, height * 0.15)
p.lineTo(width * 0.25, height * 0.55)
p.lineTo(width * 0.15, height * 0.15)
p.close()
c.setFillColor(colors.HexColor("#06B6D4"))
c.drawPath(p, fill=1, stroke=0)

# Accent rectangle - gold
c.setFillColor(colors.HexColor("#FBBF24"))
c.rect(width * 0.65, height * 0.65, width * 0.25, height * 0.15, fill=1, stroke=0)

# Small accent square
c.setFillColor(colors.HexColor("#06B6D4"))
c.rect(width * 0.08, height * 0.58, width * 0.08, height * 0.12, fill=1, stroke=0)

# TEXT - Minimal and architectural
# Main title
c.setFont("Helvetica-Bold", 80)
c.setFillColor(colors.HexColor("#0F172A"))
c.drawString(width * 0.35, height * 0.82, "RAISE")

# Subtitle
c.setFont("Helvetica", 11)
c.setFillColor(colors.HexColor("#475569"))
c.drawString(width * 0.38, height * 0.76, "INVESTMENT THESIS")

# Footer indicator
c.setFont("Helvetica-Oblique", 8)
c.setFillColor(colors.HexColor("#94A3B8"))
c.drawString(width * 0.05, height * 0.05, "Growth Vectors Design System — 2026")

c.save()
print("✅ RAISE Design Master PDF created successfully!")
