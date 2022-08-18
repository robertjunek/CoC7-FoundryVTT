/* global MutationObserver, Tour, ui */
let CoC7Tour = class internalCoC7Tour {}
if (typeof Tour !== 'undefined') {
  CoC7Tour = class internalCoC7Tour extends Tour {
    async waitForElement (selector) {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector)
        if (element) {
          resolve()
          return
        }

        const observer = new MutationObserver((mutations, observer) => {
          document.querySelectorAll(selector).forEach((el) => {
            resolve()
            observer.disconnect()
          })
        })

        observer.observe(document.body, {
          childList: true,
          subtree: true
        })
      })
    }

    async _preStep () {
      await super._preStep()

      // Close currently open applications
      if (this.stepIndex === 0) {
        for (const app of Object.values(ui.windows)) {
          app.close()
        }
      }

      await this.waitForElement(this.currentStep.selector)
    }

    async _postStep () {
      await super._postStep()
      if (this.stepIndex < 0 || !this.hasNext) {
        return
      }

      if (!this.currentStep.action) {
        return
      }

      if (this.isResetting) {
        this.isResetting = false
        return
      }

      switch (this.currentStep.action) {
        case 'click':
          document.querySelector(this.currentStep.selector).click()
          break
      }
    }

    async reset () {
      if (this.status !== 'completed') {
        this.isResetting = true
      }
      await super.reset()
    }
  }
}

export { CoC7Tour }
