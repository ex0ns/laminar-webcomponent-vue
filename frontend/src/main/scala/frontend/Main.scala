package frontend

import org.scalajs.dom
import com.raquo.laminar.api.L.*
import com.raquo.laminar.nodes.*
import com.raquo.laminar.keys.*
import com.raquo.laminar.tags.*

object Embed:
  type Ref = dom.html.Element
  val tag: HtmlTag[Ref] = htmlTag("demo-embedded")

  def apply(mods: Mod[ReactiveHtmlElement[Ref]]*) =
    tag(mods)

object Container:
  type Ref = dom.html.Element
  val tag: HtmlTag[Ref] = htmlTag("demo-container")

  def apply(mods: Mod[ReactiveHtmlElement[Ref]]*) =
    tag(mods)


@main
def main =
  val app = Container(
    cls := "custom-class",
    child <-- Val(div(cls:= "test", slot := "header", "Fill the header")),
    child <-- Val(div(cls:= "test2", slot := "header", "Fill the header (also)")),
    child <-- Val(Embed(slot := "default")),
    child <-- Val(div(slot := "footer", "Fill the footer"))
  )
  renderOnDomContentLoaded(dom.document.querySelector("#app"), app)
