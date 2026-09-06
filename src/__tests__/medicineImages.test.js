import { describe, it, expect } from 'vitest';
import { isDedicatedMedicineImage } from '../utils/medicineImages';

describe('medicineImages isDedicatedMedicineImage', () => {
  it('matches exact medicine name in title', () => {
    expect(isDedicatedMedicineImage(
      { title: 'File:Paracetamol substance photo.jpg', alt: 'Paracetamol' },
      'Paracetamol'
    )).toBe(true);
  });

  it('matches prefix-based (Aspirin -> Aspirine)', () => {
    expect(isDedicatedMedicineImage(
      { title: 'File:Aspirine macro shot.jpg', alt: '' },
      'Aspirin'
    )).toBe(true);
  });

  it('rejects false positives (crocin in fish name)', () => {
    expect(isDedicatedMedicineImage(
      { title: 'File:CtenogobCrocinNPS.jpg', alt: '' },
      'Crocin'
    )).toBe(false);
  });

  it('rejects empty medicine name', () => {
    expect(isDedicatedMedicineImage(
      { title: 'File:Some image.jpg', alt: '' },
      ''
    )).toBeFalsy();
  });

  it('rejects images with negative keywords (structure, formula, etc.)', () => {
    expect(isDedicatedMedicineImage(
      { title: 'File:Paracetamol structure diagram.jpg', alt: '' },
      'Paracetamol'
    )).toBe(false);
  });

  it('rejects images with formula in title', () => {
    expect(isDedicatedMedicineImage(
      { title: 'File:Paracetamol chemical formula.svg', alt: '' },
      'Paracetamol'
    )).toBe(false);
  });

  it('accepts valid medicine tablet strip image', () => {
    expect(isDedicatedMedicineImage(
      { title: 'File:Amoxicillin tablet.jpg', alt: 'Amoxicillin tablets' },
      'Amoxicillin'
    )).toBe(true);
  });
});
