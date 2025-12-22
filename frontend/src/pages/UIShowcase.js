import React, { useState } from "react";
import { Button, Card, Input, Badge } from "../components/ui";
import "./UIShowcase.css";

function UIShowcase() {
  const [inputValue, setInputValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  return (
    <div className="showcase-container">
      {/* Header */}
      <div className="showcase-header">
        <h1>🎨 Kissan Connect UI Design System</h1>
        <p>Complete component library and design tokens</p>
      </div>

      <div className="showcase-content">
        {/* Colors Section */}
        <section className="showcase-section">
          <h2>Color Palette</h2>
          <div className="colors-grid">
            <div className="color-box">
              <div className="color-swatch" style={{ backgroundColor: "#006676" }}></div>
              <p>Primary</p>
              <code>#006676</code>
            </div>
            <div className="color-box">
              <div className="color-swatch" style={{ backgroundColor: "#97dbe6" }}></div>
              <p>Primary Light</p>
              <code>#97dbe6</code>
            </div>
            <div className="color-box">
              <div className="color-swatch" style={{ backgroundColor: "#27ae60" }}></div>
              <p>Success</p>
              <code>#27ae60</code>
            </div>
            <div className="color-box">
              <div className="color-swatch" style={{ backgroundColor: "#e74c3c" }}></div>
              <p>Danger</p>
              <code>#e74c3c</code>
            </div>
            <div className="color-box">
              <div className="color-swatch" style={{ backgroundColor: "#f39c12" }}></div>
              <p>Warning</p>
              <code>#f39c12</code>
            </div>
            <div className="color-box">
              <div className="color-swatch" style={{ backgroundColor: "#3498db" }}></div>
              <p>Info</p>
              <code>#3498db</code>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="showcase-section">
          <h2>Typography</h2>
          <div className="typography-grid">
            <div className="text-4xl">Heading 1 (36px)</div>
            <div className="text-3xl">Heading 2 (30px)</div>
            <div className="text-2xl">Heading 3 (24px)</div>
            <div className="text-xl">Heading 4 (20px)</div>
            <div className="text-lg">Body Large (18px)</div>
            <div className="text-base">Body Regular (16px)</div>
            <div className="text-sm">Body Small (14px)</div>
            <div className="text-xs">Body XSmall (12px)</div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="showcase-section">
          <h2>Buttons</h2>
          <Card header={<strong>Button Variants & Sizes</strong>}>
            <div className="showcase-grid">
              {/* Primary Buttons */}
              <div>
                <h4>Primary Buttons</h4>
                <div className="flex flex-col gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="base">Base (Default)</Button>
                  <Button size="lg">Large</Button>
                  <Button fullWidth>Full Width</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div>
                <h4>Secondary Buttons</h4>
                <div className="flex flex-col gap-3">
                  <Button variant="secondary" size="sm">Small</Button>
                  <Button variant="secondary">Base</Button>
                  <Button variant="secondary" size="lg">Large</Button>
                  <Button variant="secondary" disabled>Disabled</Button>
                </div>
              </div>

              {/* Danger Buttons */}
              <div>
                <h4>Danger Buttons</h4>
                <div className="flex flex-col gap-3">
                  <Button variant="danger" size="sm">Small</Button>
                  <Button variant="danger">Base</Button>
                  <Button variant="danger" size="lg">Large</Button>
                </div>
              </div>

              {/* Outline Buttons */}
              <div>
                <h4>Outline Buttons</h4>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" size="sm">Small</Button>
                  <Button variant="outline">Base</Button>
                  <Button variant="outline" size="lg">Large</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="showcase-section">
          <h2>Cards</h2>
          <div className="grid grid-3 gap-6">
            <Card header={<strong>Card with Header</strong>}>
              This is a card with a header section and body content.
            </Card>

            <Card
              header={<strong>Card with Footer</strong>}
              footer={<Button size="sm">Action</Button>}
            >
              This card has both header and footer sections.
            </Card>

            <Card>
              <strong>Simple Card</strong>
              <p>A basic card with just body content.</p>
            </Card>
          </div>
        </section>

        {/* Forms Section */}
        <section className="showcase-section">
          <h2>Form Controls</h2>
          <Card header={<strong>Input Fields</strong>}>
            <div className="showcase-grid">
              <div style={{ flex: 1 }}>
                <Input
                  label="Username"
                  placeholder="Enter your username"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                />

                <Input
                  label="Birth Date"
                  type="date"
                />

                <Input
                  label="With Error"
                  placeholder="This field has an error"
                  error="This field is required"
                />

                <Input
                  label="Disabled Field"
                  placeholder="This field is disabled"
                  disabled
                />
              </div>

              <div style={{ flex: 1 }}>
                <label className="input-label">Select Field</label>
                <select>
                  <option>Choose an option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>

                <label className="input-label" style={{ marginTop: "1rem" }}>
                  Textarea
                </label>
                <textarea placeholder="Enter your message here..."></textarea>
              </div>
            </div>
          </Card>
        </section>

        {/* Badges Section */}
        <section className="showcase-section">
          <h2>Badges</h2>
          <Card>
            <div className="flex gap-3 flex-wrap">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
            </div>
          </Card>
        </section>

        {/* Spacing Section */}
        <section className="showcase-section">
          <h2>Spacing Scale</h2>
          <Card>
            <p>8px base scale:</p>
            <div className="spacing-demo">
              {[0, 1, 2, 3, 4, 5, 6, 8].map((val) => (
                <div key={val} className="spacing-box">
                  <span>{val === 0 ? "0" : `${val * 8}px`}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Utilities Section */}
        <section className="showcase-section">
          <h2>Utility Classes</h2>
          <div className="grid grid-2 gap-6">
            <Card header={<strong>Flexbox Utilities</strong>}>
              <p><code>.flex</code> - display: flex</p>
              <p><code>.flex-col</code> - flex-direction: column</p>
              <p><code>.flex-center</code> - center items</p>
              <p><code>.flex-between</code> - space-between</p>
              <p><code>.gap-4</code> - gap: 1rem</p>
            </Card>

            <Card header={<strong>Text Utilities</strong>}>
              <p><code>.text-xl</code> - font-size: 1.25rem</p>
              <p><code>.font-bold</code> - font-weight: 700</p>
              <p><code>.text-center</code> - text-align: center</p>
              <p><code>.text-primary</code> - color: primary</p>
              <p><code>.bg-gray-50</code> - background color</p>
            </Card>
          </div>
        </section>

        {/* Usage Example */}
        <section className="showcase-section">
          <h2>Quick Start</h2>
          <Card>
            <h4>Import Components</h4>
            <pre><code>{`import { Button, Card, Input, Badge } from "../components/ui";

// Use them in your component
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>

<Card header="My Card">
  <Input label="Name" />
  <Badge variant="success">Active</Badge>
</Card>`}</code></pre>
          </Card>
        </section>

        {/* CSS Variables */}
        <section className="showcase-section">
          <h2>CSS Variables</h2>
          <Card>
            <div className="showcase-grid">
              <div>
                <h4>Colors</h4>
                <p><code>--color-primary</code></p>
                <p><code>--color-success</code></p>
                <p><code>--color-danger</code></p>
              </div>
              <div>
                <h4>Typography</h4>
                <p><code>--font-size-lg</code></p>
                <p><code>--font-weight-bold</code></p>
                <p><code>--line-height-normal</code></p>
              </div>
              <div>
                <h4>Spacing</h4>
                <p><code>--spacing-4</code> (1rem)</p>
                <p><code>--spacing-8</code> (2rem)</p>
                <p><code>--spacing-16</code> (4rem)</p>
              </div>
              <div>
                <h4>Effects</h4>
                <p><code>--shadow-md</code></p>
                <p><code>--radius-lg</code></p>
                <p><code>--transition-base</code></p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default UIShowcase;
