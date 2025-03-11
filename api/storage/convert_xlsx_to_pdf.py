import pandas as pd
import pdfkit
import sys
import os

def convert_xlsx_to_pdf(input_file, output_file):
    try:
        # Load the Excel file
        df = pd.read_excel(input_file)

        # Convert to HTML table
        html_content = df.to_html()

        # Define PDF options
        options = {
            'page-size': 'A4',
            'encoding': 'UTF-8'
        }

        # Convert HTML to PDF
        pdfkit.from_string(html_content, output_file, options=options)
        print("Success")  # Return success response
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    convert_xlsx_to_pdf(input_path, output_path)
