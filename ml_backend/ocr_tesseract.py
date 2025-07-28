import fitz
import os
import shutil
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter

# check if folder exists
if not os.path.exists('images'):
    os.makedirs("images") # if not create that folder
    
# ---------------------------------------------------- #
def return_text():
    # choose pdf name ( will be made dynamic )
    pdffile = "stored_pdf/multi_page_dummy_report.pdf"
    # open that pdf with fitz
    doc = fitz.open(pdffile)

    # iter through all the pages
    for idx, page in enumerate(doc):
        current_page = page.get_pixmap()
        output = f"images/output{idx}.png" # and get their appropriate images
        current_page.save(output) # save them in the path mentioned above

    # ---------------------------------------------------- #

    # close the document after use
    doc.close()

    text = []
    for images in os.listdir('images'):
        if (images.endswith(".png")):
            image = Image.open(f'images/{images}').convert("L") # converting to grayscale here
            
            enhancer_S = ImageEnhance.Sharpness(image) # enhancer sharpness
            enhancer_C = ImageEnhance.Contrast(image) # enhancer contrast 
            
            image = enhancer_C.enhance(3.0) # triple the intensity 
            image = enhancer_S.enhance(3.0) # triple the sharpness
            image = image.resize((image.width * 2, image.height * 2)) # 2x target dimensions
            image = image.point(lambda x: 0 if x < 160 else 255, '1') # make black after a certain threshold totally black
            
            # image.show() # show image for testing purposes

            text.append(pytesseract.image_to_string(image, lang='eng')) # extract text 

    shutil.rmtree('images')        
    return (text)

