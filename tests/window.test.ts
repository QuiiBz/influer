/**
 * @jest-environment jsdom
 */

import '../src';

describe('default function', () => {
  it('should be defined in window', () => {
    expect(window.influer).toBeDefined();
  });
});
