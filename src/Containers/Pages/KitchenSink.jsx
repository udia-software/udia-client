import React from "react";
import { CenterContainer } from "Components/Styled";

export const KitchenSinkPage = () => {
  document.title = "Kitchen Sink - UDIA";

  return (
    <CenterContainer>
      <h1>Kitchen Sink</h1>
      <p>
        A "kitchen sink" is a state that shows all the features and whistles.
      </p>
      <p>
        A small paragraph to <em>emphasis</em> and show{" "}
        <strong>important</strong> bits.
      </p>
      <hr />
      <ul>
        <li>
          This is a <strong>list</strong> item
        </li>
        <li>So is this - there could be more</li>
        <li>
          Make sure to style list items to:
          <ul>
            <li>Not forgetting child list items</li>
            <li>Not forgetting child list items</li>
            <li>Not forgetting child list items</li>
            <li>Not forgetting child list items</li>
          </ul>
        </li>
        <li>A couple more</li>
        <li>top level list items</li>
      </ul>
      <hr />
      <ol>
        <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
        <li>
          Aliquam tincidunt mauris eu risus.
          <ol>
            <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
            <li>Aliquam tincidunt mauris eu risus.</li>
          </ol>
        </li>
        <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
        <li>Aliquam tincidunt mauris eu risus.</li>
      </ol>
      <hr />
      <h2>Many worded paragraph</h2>
      <p>
        Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
        ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
        egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend
        leo. Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
        vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet
        quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat
        eleifend leo. Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
        vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet
        quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat
        eleifend leo.
      </p>
      <hr />
      <h2>Table</h2>
      <table
        className="t1"
        summary="Top 10 downloaded movies in 2011 using BitTorrent, in descending order, listing number of downloads and worldwide cinema grosses"
      >
        <caption>I'm a table's caption</caption>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Movie</th>
            <th>Downloads</th>
            <th>Grosses</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th colSpan="4">I'm a table's footer</th>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <th>1</th>
            <td>Fast Five</td>
            <td>9,260,000</td>
            <td>$626,137,675</td>
          </tr>
          <tr>
            <th>2</th>
            <td>The Hangover II</td>
            <td>8,840,000</td>
            <td>$581,464,305</td>
          </tr>
          <tr>
            <th>3</th>
            <td>Thor</td>
            <td>8,330,000</td>
            <td>$449,326,618</td>
          </tr>
          <tr>
            <th>4</th>
            <td>Source Code</td>
            <td>7,910,000</td>
            <td>$123,278,618</td>
          </tr>
          <tr>
            <th>5</th>
            <td>I Am Number Four</td>
            <td>7,670,000</td>
            <td>$144,500,437</td>
          </tr>
          <tr>
            <th>6</th>
            <td>Sucker Punch</td>
            <td>7,200,000</td>
            <td>$89,792,502</td>
          </tr>
          <tr>
            <th>7</th>
            <td>127 Hours</td>
            <td>6,910,000</td>
            <td>$60,738,797</td>
          </tr>
          <tr>
            <th>8</th>
            <td>Rango</td>
            <td>6,480,000</td>
            <td>$245,155,348</td>
          </tr>
          <tr>
            <th>9</th>
            <td>The King’s Speech</td>
            <td>6,250,000</td>
            <td>$414,211,549</td>
          </tr>
          <tr>
            <th>10</th>
            <td>Harry Potter and the Deathly Hallows Part 2</td>
            <td>6,030,000</td>
            <td>$1,328,111,219</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <table>
        <tbody>
          <tr>
            <th>Table Heading</th>
            <th>Table Heading</th>
          </tr>
          <tr>
            <td>table data</td>
            <td>table data</td>
          </tr>
          <tr>
            <td>table data</td>
            <td>table data</td>
          </tr>
          <tr>
            <td>table data</td>
            <td>table data</td>
          </tr>
          <tr>
            <td>table data</td>
            <td>table data</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
      <hr />
      <blockquote>
        <em>This is a properly formatted blockquote, btw.</em>
        <p>
          Measuring programming progress by lines of code is like measuring
          aircraft building progress by weight.
        </p>
        <footer>
          —{" "}
          <cite>
            <a href="http://www.thegatesnotes.com">Bill Gates</a>
          </cite>
        </footer>
      </blockquote>
      <hr />
      <pre>Pre Tag</pre>
      <code>Code Tag</code>
      <pre>
        <code>var a = foobar();</code>
      </pre>
      <hr />
      <dl>
        <dt>Definition list</dt>
        <dd>
          Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </dd>
        <dt>UDIA</dt>
        <dd>
          Universal wildcard.
        </dd>
      </dl>
      <hr />
      <blockquote>
        <p>
          Paragraph inside Blockquote: Nam libero leo, elementum in, dapibus a,
          suscipit vitae, purus. Duis arcu. Integer dignissim fermentum enim.
          Morbi convallis felis vel nibh. Sed scelerisque sagittis lorem.
        </p>
      </blockquote>
      <hr/>
      <address>Address: Example address 224, Sweden</address>
      <pre>
        <strong>Preformated:</strong>Testing one row and another
      </pre>
      <hr/>
      <p>
        I am <a href="?abc123">the a tag</a><br />
        I am <abbr title="test">the abbr tag</abbr><br />
        I am <acronym>the acronym tag</acronym><br />
        I am <b>the b tag</b><br />
        I am <big>the big tag</big><br />
        I am <cite>the cite tag</cite><br />
        I am <code>the code tag</code><br />
        I am <del>the del tag</del><br />
        I am <dfn>the dfn tag</dfn><br />
        I am <em>the em tag</em><br />
        I am <i>the i tag</i><br />
        I am <ins>the ins tag</ins><br />
        I am <kbd>the kbd tag</kbd><br />
        I am <q>the q tag</q><br />
        I am <samp>the samp tag</samp><br />
        I am <small>the small tag</small><br />
        I am <span>the span tag</span><br />
        I am <strong>the strong tag</strong><br />
        I am <sub>the sub tag</sub><br />
        I am <sup>the sup tag</sup><br />
        I am <tt>the tt tag</tt><br />
        I am <var>the var tag</var><br />
      </p>
      <hr />
      <ul>
        <li>Unordered list 01</li>
        <li>Unordered list 02</li>
        <li>
          Unordered list 03
          <ul>
            <li>Unordered list inside list level 2</li>
            <li>
              Unordered list inside list level 2
              <ul>
                <li>Unordered list inside list level 3</li>
                <li>Unordered list inside list level 3</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
      <ol>
        <li>Ordered list 01</li>
        <li>Ordered list 02</li>
        <li>
          Ordered list 03
          <ol>
            <li>Ordered list inside list level 2</li>
            <li>
              Ordered list inside list level 2
              <ol>
                <li>Ordered list inside list level 3</li>
                <li>Ordered list inside list level 3</li>
              </ol>
            </li>
          </ol>
        </li>
      </ol>
      <dl>
        <dt>Description list title 01</dt>
        <dd>Description list description 01</dd>
        <dt>Description list title 02</dt>
        <dd>Description list description 02</dd>
        <dd>Description list description 03</dd>
      </dl>
      <table>
        <caption>Table Caption</caption>
        <thead>
          <tr>
            <th>Table head th</th>
            <td>Table head td</td>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>Table foot th</th>
            <td>Table foot td</td>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <th>Table body th</th>
            <td>Table body td</td>
          </tr>
          <tr>
            <td>Table body td</td>
            <td>Table body td</td>
          </tr>
        </tbody>
      </table>
      <form action="#">
        <fieldset>
          <legend>Form legend</legend>
          <div>
            <label htmlFor="f1">Text input:</label>
            <input type="text" id="f1" defaultValue="input text" />
          </div>
          <div>
            <label htmlFor="pw">Password input:</label>
            <input type="password" id="pw" defaultValue="password" />
          </div>
          <div>
            <label htmlFor="f2">Radio input:</label>
            <input type="radio" id="f2" />
          </div>
          <div>
            <label htmlFor="f3">Checkbox input:</label>
            <input type="checkbox" id="f3" />
          </div>
          <div>
            <label htmlFor="f4">Select field:</label>
            <select id="f4">
              <option>Option 01</option>
              <option>Option 02</option>
            </select>
          </div>
          <div>
            <label htmlFor="f5">Textarea:</label>
            <textarea id="f5" cols="30" rows="5" defaultValue="Textarea text" />
          </div>
          <div>
            <label htmlFor="f6">Input Button:</label>
            <input type="button" id="f6" defaultValue="button text" />
          </div>
          <div>
            <label>
              Button Elements:{" "}
              <span className="small quiet">
                Can use &lt;button&gt; tag or &lt;a className="button"&gt;
              </span>
            </label>
            <button className="button positive">
              <img
                src="https://raw.githubusercontent.com/ericrasch/html-kitchen-sink/master/web/assets/img/icons/tick.png"
                alt=""
              />{" "}
              Save
            </button>
            <a className="button" href="/">
              <img
                src="https://raw.githubusercontent.com/ericrasch/html-kitchen-sink/master/web/assets/img/icons/key.png"
                alt=""
              />
              Change Password
            </a>{" "}
            <a href="/" className="button negative">
              <img
                src="https://raw.githubusercontent.com/ericrasch/html-kitchen-sink/master/web/assets/img/icons/cross.png"
                alt=""
              />{" "}
              Cancel
            </a>
          </div>
        </fieldset>
      </form>
    </CenterContainer>
  );
};

export default KitchenSinkPage;
