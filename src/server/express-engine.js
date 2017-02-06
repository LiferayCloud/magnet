import express from 'express';
import BaseEngine from './base-engine';

/**
 * Engine interface
 */
class ExpressEngine extends BaseEngine {

  /**
   * Constructor
   */
  constructor() {
    super();
    this.setEngine(express());
  }
}

export default ExpressEngine;
