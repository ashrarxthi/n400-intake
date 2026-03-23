import { PDFDocument } from 'pdf-lib'
import { readFileSync } from 'fs'

const pdfBytes = readFileSync('./public/n-400.pdf')
const pdfDoc = await PDFDocument.load(pdfBytes, { 
  ignoreEncryption: true,
  throwOnInvalidObject: false,
  updateMetadata: false
})
const form = pdfDoc.getForm()
const fields = form.getFields()
console.log(`Total fields: ${fields.length}`)
fields.forEach((f, i) => {
  console.log(`${i+1}. [${f.constructor.name}] ${f.getName()}`)
})

