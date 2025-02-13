(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function a(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(e){if(e.ep)return;e.ep=!0;const i=a(e);fetch(e.href,i)}})();async function p(n,t){const a=`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${n}`,o=await fetch(a,{method:"POST",headers:{"Content-Type":t.type},body:t});if(!o.ok){const i=await o.text();throw new Error(`File upload failed with status ${o.status}: ${i}`)}const e=await o.json();if(!e.file)throw new Error("File upload did not return a file object.");return e.file}async function u(n,t,a){const o=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${n}`,e={contents:[{parts:[{text:a},{file_data:{mime_type:t.mimeType,file_uri:t.uri}}]}],generationConfig:{response_mime_type:"application/json",response_schema:{type:"OBJECT",properties:{latex:{type:"STRING"}},required:["latex"]}}},i=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!i.ok){const f=await i.text();throw new Error(`API request failed with status ${i.status}: ${f}`)}const s=await i.json();if(!s.candidates||s.candidates.length===0)throw new Error("No candidates returned from the API.");const r=s.candidates[0].content.parts[0].text;console.log("Raw candidate output:",r);let l;try{l=JSON.parse(r)}catch{const d=r.indexOf("{"),c=r.lastIndexOf("}");if(d!==-1&&c!==-1&&c>d){const m=r.substring(d,c+1);try{l=JSON.parse(m)}catch{throw new Error("Failed to extract and parse JSON from output: "+r)}}else throw new Error("No valid JSON structure found in output: "+r)}if(!l.latex)throw new Error("Structured output did not contain 'latex'. Output: "+JSON.stringify(l));return l.latex}const g=`
<purpose>

    You are an expert at performing OCR on user input handwritten notes and translating them into LaTeX code.

    Your goal is to extract all text and figures from the input and recreate them in LaTeX format, preserving the original content faithfully.

</purpose>

<instructions>

    <instruction>

        Analyze the image and extract all text, typed or handwritten, without omission or alteration. Replicate this extracted text exactly in LaTeX code.

    </instruction>

    <instruction>

        Identify any figures (graphs, charts, diagrams, etc.) and reproduce them in LaTeX. Consider the layout and formatting of the original notes, maintaining both readability and faithfulness to the source.

    </instruction>

    <instruction>

        Draw inspiration from the provided LaTeX notes example for aesthetics and formatting. Adapt as necessary, keeping in mind LaTeX complexity and referencing suitable packages from https://www.ctan.org/pkg/.

    </instruction>

</instructions>

<examples>

     <example>
          \\chapter{Morse theory}
\\label{chap:morse-theory}
\\vspace*{-0.9cm}

% \\startcontents[chapters]
% \\printcontents[chapters]{}{1}{}

When studying manifolds it often proves useful to examine simple structures that live on them. For example, differential forms give rise to the de Rham cohomology, which tells us something about the global structure of the manifold.
In this thesis the objects of interest will be nice real valued functions $f: M \\to  \\R$, which we will call Morse functions, named after the American mathematician Marston Morse.

We will start off this chapter by giving several definitions of Morse functions and showing that they are equivalent.
We will show that Morse functions give rise to handlebody decompositions which decompose any manifold in standard building blocks called handles.
We will end the chapter by showing that any manifold admits a Morse function, and in fact infinitely many.

\\section{Definition of a Morse function}

A Morse function $f: M \\to \\R$ is a \`nice' real valued function on a manifold, which will in this context mean that $f$ behaves nicely around its critical points. Let us first recall what a critical point is.

\\begin{definition}[Critical point]
    Let $M$ and $N$ be a manifolds and  $f$ a map from $M$ to $N$.
    The set of critical points of $f$ is given by
    \\[
    \\Crit f = \\{p \\in M  \\mid \\text{$df_p$ is not surjective}\\}
    .\\]
\\end{definition}
Note that in particular, if $N = \\R$ we have that the set of critical points is given by $\\Crit f = \\{ p \\in M  \\mid  df_p = 0\\}$.  The maps we will be considering are then characterised as follows:
\\begin{definition}[Morse function\\sidenotemark]
    Let $M$ be a manifold.
    A function $f: M \\to  \\R$ is a \\emph{Morse function} if for all critical points $p$, there exists a chart centred around $p$ such that $f$ is locally given by
    \\[
        f(x) = f(p) -x_1^2 - \\cdots - x_k^2 + x_{k+1}^2 + \\cdots + x_n^2
    .\\]
    Such a chart is said to be a \\emph{Morse chart} and we call $k$ the index of $p$, which we will denote with $\\Ind p$.
\\end{definition}
\\sidenotetext[]{\\fullcite{morse1925relations}}

Intuitively, the index of a critical point $p$ is \`the number of downward directions'.
Let us give some examples of Morse functions.
\\begin{marginfigure}
    \\centering
    \\incfig{examples-of-morse-functions}
    \\caption{Example of a Morse function on the torus. At each critical point, the index $k$, the number of downward directions is indicated. }
    \\label{fig:examples-of-morse-functions}
\\end{marginfigure}
\\begin{eg}
    Let $M$ be the torus  $T^2$ embedded in $\\R^3$ as illustrated in Figure~\\ref{fig:examples-of-morse-functions}.
    Then the height function $h: T^2 \\to  \\R$ which is the projection on the $z$-axis is a Morse function with four critical points.
    We have a minimum, two saddle points and a maximum, whose indices are $0, 1, 1, 2$ respectively.
\\end{eg}


\\begin{marginfigure}
    \\centering
    \\incfig{morse-function-sphere-example}
    \\caption{Two Morse functions on $S^2$ with a different number of critical points.}
    \\label{fig:morse-function-sphere-example}
\\end{marginfigure}
\\begin{eg}
    In Figure~\\ref{fig:morse-function-sphere-example}, we have illustrated two embeddings of $S^2$ in $\\R^3$, and considering the corresponding height functions, we get two Morse functions $S^2 \\to  \\R$.
    The first one has only two critical points: a maximum and a minimum.
    The second one has two maxima, a saddle point and a minimum.
    Later on we will prove that any manifold admitting a Morse function with only two critical points is homeomorphic to the sphere.
\\end{eg}


\\begin{marginfigure}
    \\centering
    \\incfig{non-example-of-morse-function}
    \\caption{An example of an embedding where the height function is not Morse.}
    \\label{fig:non-example-of-morse-function}
\\end{marginfigure}
\\begin{noneg}
    Let $M = \\R^2$ and $f: \\R^2 \\to  \\R: (x, y) \\mapsto  x^2$.
    Then all points $(0, y)$ for  $y \\in \\R$ are critical points of this function.
    In particular, $(0, 0)$ is a critical point.
    As it is impossible to find local coordinates $(x_1, x_2)$ for which $f$ can be written as $\\pm x_1^2 \\pm x_2^2$, we conclude that $f$ is not Morse.
\\end{noneg}
\\begin{marginfigure}
    \\centering
    \\incfig{non-examples-of-morse-functions}
    \\caption{An example of a function that is not Morse: $f: \\R \\to  \\R: x \\mapsto  x^3$.
        Small perturbations of $f$ are Morse.
    }
    \\label{fig:non-examples-of-morse-functions}
\\end{marginfigure}
\\begin{noneg}
    Let $M = \\R$ and $f : \\R \\to  \\R: x \\mapsto x^3$.
    Then $x = 0$ is a critical point, but $f$ is not Morse.
    Note however that if we add a small perturbation to $f$, say $g_t: x\\mapsto x^3+ tx$, then for small non-zero $t$, $g$ is Morse. For $t < 0$, $g_t$  has two critical points: one of index $1$ and one of index $0$.
    If $t > 0$,  $g_t$ has no critical points.
    \\label{eg:cube}
\\end{noneg}

Note that this last case where $f$ has no critical points cannot happen if $M$ is compact.
Indeed, any function attains it maximum and minimum on a compact manifold, so we have at least two critical points.
On the other hand, the number of critical points is at most finite.
This is because of the definition of a Morse function: it implies that critical points are isolated, which on a compact manifold implies that their number is finite.
This also immediately rules out the situation we had in the other example, where the set of critical points was a straight line.

\\section{Coordinate-free definition}

The attentive reader will have noticed that the notion of the index of a critical point could possibly be coordinate dependent and hence ill-defined.
In order to show that it is not, we will give an equivalent coordinate-free definition.
For this, let us first define the Hessian:
\\begin{definition}[Hessian]
    Let $M$ be a manifold and $f: M \\to  \\R$ a function.
    Let $p$ be a critical point of $f$.
    Then we define the Hessian $H_p$ to be the bilinear form
    \\begin{align*}
        H_p: T_pM \\times T_pM &\\longrightarrow  \\R\\\\
        (X, Y) &\\longmapsto X (\\tilde{Y} f)|_p
    ,\\end{align*}
    where $\\tilde{Y}$ is a local extension of $Y$ around $p$.
\\end{definition}
Because we are only considering the Hessian $H_p$ at critical points, this is a well defined symmetric bilinear form.\\sidenote{The difference between $H_p(X, Y)$ and  $H_p(Y, X)$ is given by
\\begin{align*}
    H_p(X, Y) - H_p(Y, X) &= X(\\tilde{Y} f)|_p - Y (\\tilde{X} f)|_p\\\\
                          &= [\\tilde{X}, \\tilde{Y}] f |_p\\\\
                          &= df_p [\\tilde{X}, \\tilde{Y}]|_p = 0
.\\end{align*}
The value of $H_p$ also does not depend on the extension of the vector field.
Indeed, suppose $\\tilde{Y}$ and $\\overline{Y}$ are two different extensions of $Y$. Then by symmetry of $H_p$, we have
\\[
    X(\\tilde{Y} f)|_p = Y(\\tilde{X} f)|_p = X(\\overline{Y}f )|_p
.\\]
This also shows linearity of the second component.
}
In case of a Morse function given locally by $f(x) = f(p) - x_1^2 - \\cdots - x_k^2 + x_{k+1}^2 + \\cdots + x_n^2$, the Hessian at $p$ is
\\[
    H_p = 2(- dx_1^2 - \\cdots - dx_k^2 + dx_{k+1}^2  + \\cdots + dx_n^2)
,\\]
where $dx_i^2 = dx_i \\otimes dx_i$.
Note in particular that $H_p$ is non-degenerate and its signature is $(i_-, i_{+}) = (k, n-k)$, as we have $k$ negative eigenvalues and $n-k$ positive eigenvalues.
As the signature of a symmetric bilinear form is coordinate independent, this shows that the index of a critical point is as well.


Interestingly, the converse is also true: if $H_p$ is non-degenerate for all critical points  $p$ of $f$, then  $f$ is a Morse function.
Many authors take this to be the definition of a Morse function, and then prove the so-called Morse lemma stating that there always exist local coordinates such that $f$ is given by
\\[
    f(x) = f(p) - x_1^2 - \\cdots - x_k^2 + x_{k+1}^2 + \\cdots + x_n^2
,\\]
which is our definition of a Morse function.
With our choice, the Morse lemma takes on the following form:
\\begin{lemma}[Morse Lemma]
    Let $M$ be a manifold and $f: M \\to  \\R$ a smooth function.
    If for all $p \\in \\Crit f$, the Hessian $H_p$ is non-degenerate, then $f$ is Morse.
\\end{lemma}
\\begin{myproof}
    We follow the proof of Milnor\\sidecite[6]{milnor}.
    We may assume that $M = \\R^{n}$, $p$ is the origin and $f(p) = 0$.
    Then by a version of Taylor's theorem, we can write
    \\begin{align*}
        f(x)  &= f(p) + \\sum_{i=1}^{n} (x_i - p_i) g_i (x)\\\\
              &= \\sum_{i=1}^{n} x_i g_i(x)
    ,\\end{align*}
    where $g_i$ are smooth functions.
    Now, as $g_i(0) = \\partial_i f (0) = 0$, we can repeat this for each  $g_i$, giving us the following:
    \\[
        f(x) = \\sum_{i, j= 1}^{n} x_i x_j h_{ij}(x)
    .\\]
    Because this sum is symmetric in $i$ and  $j$, we may assume that  $h_{ij}$ is symmetric as well.\\sidenote{If $h_{ij}$ is not symmetric, we can replace it by $h_{(ij)} = \\frac{1}{2}(h_{ij} + h_{ji})$. Then $h_{(ij)}$ is symmetric and we still have $\\sum x_{i}x_{j}h_{ij} = \\sum x_{i}x_{j}h_{(ij)}$.}
    Note that
    \\[
        h_{ij}(0) = \\frac{1}{2} \\partial_{ij} f(0)
    ,\\]
    which is non-degenerate by assumption.

    Now we imitate the proof of diagonalization of a non-degenerate quadratic form.
    We do this by induction.
    Suppose we have coordinates $u_1, \\cdots, u_n$ in a neighbourhood of $0$ such that
    \\[
        f = \\pm u_1^2 \\pm \\cdots \\pm u_{r-1}^2 + \\sum_{i,j\\ge r} u_i u_j H_{ij}(u)
    ,\\]
    where $H_{ij}$ is a symmetric matrix.
    After a linear change, we may assume by non-degeneracy that $H_{rr} \\neq 0$.
    Then define new coordinates $ v_1, \\ldots, v_r$ as follows:
    \\[
        v_i = \\begin{cases}
            u_i & \\text{if $i \\neq r$}\\\\
            \\sqrt{|H_{rr}|} (u_r + \\sum_{i > r} u_i H_{ir} / H_{rr}) & \\text{if $i = r$.}
        \\end{cases}
    \\]
    Note that we may need to restrict the neighbourhood such that $\\sqrt{|H_{rr}|} \\neq 0$.
    Then we have that
    \\[
        f = \\sum_{i\\le r} \\pm v_i^2 + \\sum_{i,j > r} v_i v_j H_{ij}'(v)
    .\\]
    for some symmetric matrix $H_{ij}'$.
    By induction, we can find coordinates such that
    $f = \\sum_{i=1}^{n} \\pm v_i^2$, completing the proof.
\\end{myproof}

\\section{Handle decompositions}
In this section we show how a Morse function $f: M \\to  \\R$ gives rise to a step by step guide on how to build the manifold $M$ out of basic building blocks.
In order to show how this is done, we need to introduce the notion of a cobordism.


\\begin{definition}
A cobordism between two compact manifolds $M_0$ and $M_1$ is a compact manifold $M$  with boundary $\\partial M = M_0 \\sqcup M_1$.
\\end{definition}

In this text, we will often say that $M$ is a cobordism \\emph{from $M_0$ to $M_1$.}
The term \`cobordism' comes from the fact that $M_0 \\sqcup M_1$ are the boundary of $M$, so we can think of $M$ as the \`co-boundary' of $M_0$ and $M_1$.
Cobordisms are an interesting topic in their own right.
For example, they define an equivalence relation on all compact manifolds of the same dimension. Two manifolds $ M_0$ and $M_1$ are then said to be equivalent (cobordant) if there exists a cobordism $M$ connecting the two.
This equivalence relation is much coarser than diffeomorphism and is generally easier to study.
Cobordisms also form a category where the objects are manifolds and the morphisms are cobordisms.

We have illustrated some examples below.
Note that we may also take $M_0$ or $M_1 = \\O$.
In particular, any closed manifold is a cobordism from $\\O$ to $\\O$.
\\begin{figure*}[H]
    \\centering
    \\sidecaption[][-8ex]{Some examples of cobordisms.
        Notice that if the height function does not have critical points, the topology of the bottom is the same as that of the top.
    \\label{fig:examples-of-cobordisms} }
    \\fullwidthincfig{examples-of-cobordisms}
\\end{figure*}

When we consider the height function $f: M \\to  [0, 1]$ on these examples,
we observe that the topology of the bottom is the same as that of the top if the height function does not have critical points.
In the case when the height function has a single critical point, the topology does change and it will turn out we can very concretely describe \\emph{how} this topology changes if $f$ is Morse (as is the case here).

\\subsubsection*{Cobordisms without critical points}
Let us first consider the case where the height function has no critical points.
For simplicity, we introduce the following refined definition of a Morse function on a cobordism:
\\begin{definition}[Morse function on a cobordism\\sidenotemark]
    Let $M$ be a cobordism from $M_0$ to $M_1$.
    A function $f: M \\to  [a, b]$ is Morse if
    \\begin{itemize}
        \\item $M_0 = f^{-1}(a)$, $M_1 = f^{-1}(b)$
        \\item All critical points lie interior in $M$ and are non-degenerate.
    \\end{itemize}
\\end{definition}
\\sidenotetext[][-2.5cm]{\\fullcite[8]{hcobord}}

Let us now prove our first observation:
\\begin{prop}
    Suppose $f: M \\to  [a, b]$ is a Morse function on a cobordism $M$ from  $ M_0$ to $ M_1$.
    If $f$ has no critical points, then $M$ is diffeomorphic to $[a, b] \\times  M_0$.
\\end{prop}

\\begin{myproof}
    \\begin{marginfigure}
        \\centering
        \\incfig{proof-of-cobordism-without-critical-points}
        \\caption{
            When a cobordism has no critical points, it is diffeomorphic to a product manifold. }
        \\label{fig:proof-of-cobordism-without-critical-points}
    \\end{marginfigure}
    Choose a Riemannian metric $\\left<\\cdot ,\\cdot  \\right>$ on $M$.
    Because  $f$ has no critical points, the gradient vector field $W = \\grad f := (df)^{\\sharp}$ never vanishes.\\sidenote{Here we use $\\sharp$ and $\\flat$ for the \`musical isomorphisms' induced by a metric $\\left< \\cdot, \\cdot \\right>$, given by
        \\begin{align*}
            \\flat: TM \\longrightarrow T^*M: &\\:X \\longmapsto X^{\\flat} = \\left<X, - \\right>\\\\
            \\sharp: T^*M \\longrightarrow TM :&\\:\\alpha \\longmapsto \\alpha^{\\sharp}
        ,\\end{align*}
        where $\\alpha^\\sharp$ is uniquely defined by $\\langle\\alpha^\\sharp, X\\rangle = \\alpha(X)$.
        In other words $\\sharp = (\\flat)^{-1}$.
    }
    Now we normalize the vector field as follows:
    \\[
    V = \\frac{1}{\\left<W, W \\right>} W
    .\\]
    Then $df(V) = \\frac{1}{\\left<W, W \\right>} df(W) = 1$.
    Consider
    \\begin{align*}
        \\phi: [0, 1] \\times M_0&\\longrightarrow M \\\\
        (t, p) &\\longmapsto \\theta_V^{t}(p)
    ,\\end{align*}
    where $\\theta_V^{t}$ is the flow along $V$.
    Then $f(\\phi(t, p)) = t$ for all $p \\in M_0$, as $df(V) = 1$.
    The map $\\phi$ is injective because of the uniqueness of flows, and surjective because given a point $p$ in $M$, we can always flow back along $V$ for a time $t$ to find a $p_0 \\in M_0$ which then satisfies $\\phi(t, p_0) = p$.
    Because this is also smooth, this proves that $\\phi$ is a diffeomorphism.
\\end{myproof}

\\begin{remark}
    While almost trivial, this result is very useful and lies at the basis of the proof of the $h$-cobordism theorem, stating that a cobordism satisfying certain properties is a trivial cobordism.\\sidecite[p.~107]{hcobord}
    We will prove this in Chapter~\\ref{chap:h-cobord} by showing that an $h$-cobordism admits a Morse function without any critical points, implying the result.

    In general, this result can be used to show that two manifolds are diffeomorphic. If we can construct a cobordism from $M_0$ to $M_1$ and we can prove the existence of a Morse function without critical points, then $M_0 \\cong M_1$.
\\end{remark}

\\subsubsection*{Cobordisms with a single critical point}
Let us now investigate the situation when a Morse function $f$ does have a single critical point, say $p$ and assume $f(p) = 0$.
Then we know $f$ is locally of the following form:
\\[
    f(x_1, \\ldots, x_n) = - x_1^2 - \\cdots - x_k^2 + x_{k+1}^2 + \\cdots + x_n^2
.\\]
\\begin{figure}[H]
    \\centering
    \\sidecaption{Around a critical point of a Morse function, we can find a chart as on the left. The dark region corresponds to $f(x) < 0$ and  the light region to $f(x) >0$. The level set $f^{-1}(0)$ is not a manifold.  \\label{fig:morse-chart}}
\\incfig{morse-chart}
\\end{figure}
\\vspace{-1cm}
Above, we have plotted the first $k$ variables (the \`downward directions') on the horizontal axis, and the last $n-k$ variables on the vertical axis.
Then the level set $f^{-1}(0)$ is given by
\\[
x_1^2 + \\cdots + x_k^2 = x_{k+1} ^2 + \\cdots + x_n^2
,\\]
which consists of the two crossing lines in the figure, corresponding to the crossing part of the figure-eight on the right.
Level sets of values slightly above and below $0$ look locally like hyperbolas on our figure, but recall that the axes consist of multiple dimensions, so it would be more precise to call them hyperboloids. We give some more concrete examples for $n=2,3$ and  $k=0,1,2,3$ in the following table:
\\bigskip
\\begin{table}[H]
    \\centering
    \\sidecaption[][-0.5cm]{Some examples of Morse charts in dimension two and three.
        We have indicated the level sets of the Morse function.
    \\label{fig:more-concrete-morse-charts}}
    \\incfig{more-concrete-morse-charts}
\\end{table}
\\clearpage

To better understand the effect of the critical point,
we want to isolate its behaviour.
We will do this by cutting out a part of a Morse neighbourhood of $p$ of a very specific form, as shown in yellow in Figures~\\ref{fig:morse-chart-flow-lines} and \\ref{fig:morse-chart-zoomed-in}.
The part we cut out is bounded by level sets $f(p) = \\pm \\epsilon$ and negative gradient flow lines of  $f$.\\sidenote[][-2cm]{
    Two remarks. First, while it does not really matter if we choose the negative or positive gradient, it is customary in Morse theory to use the latter.
    The gradient flow of a height function flows then from top to bottom which is arguably more intuitive when one thinks of it like water flowing down a mountain.\\\\[0.3em]
Secondly, a gradient is a choice, and here we choose the gradient w.r.t.\\ the standard metric on $\\R^{n}$. More explicitly, we know that locally around a critical point $p$, $f$ is given by
    \\begin{align*}
        f(x_1, \\ldots, x_n) &= f(p) - x_1^2 - \\cdots - x_k^2\\\\
                            & \\qquad + x_{k+1}^2 + \\cdots + x_n^2
    .\\end{align*}
    Then the standard negative gradient of $f$ is
    \\begin{align*}
        - \\grad f &= 2 x_1 \\partial_{1} + \\cdots + 2 x_k \\partial_{k}\\\\
                & \\qquad - 2 x_{k-1} \\partial_{k-1} - \\cdots - 2 x_n \\partial_{n}.
    \\end{align*}}
The advantage of cutting in this specific way, is that we have split up the cobordism in three parts which we understand well:
\\begin{itemize}
    \\item[\\circled{A}] The part below $-\\epsilon$ and the part above $\\epsilon$ have a product structure, because we assumed the only critical value was $0$.
        We can simply repeat the proof above.
    \\item[\\circled{B}] The part of $M$ that lies between $-\\epsilon$  and $\\epsilon$ without $\\circled{H}$ also has a product structure.
        To see this, extend the metric introduced on $\\circled{H}$ for defining the gradient to the whole manifold. Then, because $f$ has no critical values outside $\\circled{H}$, we can flow along gradient lines giving us a product structure.
        Now it should be clear why we wanted to cut along gradient lines.

        Riemannian metrics that are an extension of standard metrics around critical points are called \`adapted.'
        Using a partition of unity argument, one can show any manifold equipped with a Morse function admits such metrics.
        In most cases, we will often forget about the metric itself and simply consider vector fields which are gradient-like for $f$:

        \\begin{marginfigure}
            \\centering
            \\incfig{morse-chart-flow-lines}
            \\caption{A Morse chart with negative gradient flow lines added.
            The coloured area represents a handle. Its boundary consists of parts of level sets of $f$ and flow lines of $\\grad f$.}
            \\label{fig:morse-chart-flow-lines}
        \\end{marginfigure}
        \\begin{marginfigure}
            \\centering
            \\incfig{morse-chart-zoomed-in}
            \\caption{A cobordism with one critical point splits up in product structures and a handle.}
            \\label{fig:morse-chart-zoomed-in}
        \\end{marginfigure}

        \\begin{definition}[Pseudo-gradient]
            Let $f: M \\to  \\R$ be a Morse function on a manifold $M$. A pseudo-gradient is a vector field $X$ such that
            \\begin{itemize}
                \\item $df(X) \\le 0$ and $df(X) = 0$ only at critical points
                \\item $X$ coincides in Morse charts with the usual negative gradient for the standard metric on $\\R^{n}$.
            \\end{itemize}
        \\end{definition}
    \\item[\\circled{H}]  The yellow part is what we call a \\emph{handle of index $k$}, and is homeomorphic to $\\cdisk{k} \\times \\cdisk{n-k}$.
        This is the only non-trivial part of our cobordism.
        We call the bottom part of the border the \\emph{attachment region}, which is homeomorphic to $\\sphere{k-1} \\times \\cdisk{n-k}$.
        % TODO add terminology bottom, top, \\ldots

\\begin{definition}[$k$-handle]
    A $k$-handle is a thickened up $k$-cell: $\\cdisk{k} \\times \\cdisk{n-k}$.
    The bottom of the handle, $S_k = \\partial B^{k} \\times B^{n-k} = \\sphere{k-1} \\times \\cdisk{n-k}$ is called the \\emph{attachment region}.
    \\end{definition}
\\end{itemize}

We conclude that a cobordism with exactly one critical point consists of product structures and a $k$-handle, where $k$ is the index of the critical point.

    In this context the concept of a handle is something that arises from an existing Morse function $f:M \\to  \\R$ on a manifold.
    However we can also view them as standalone objects that we can attach to an existing manifold with boundary, in this case $N = f^{-1}(-\\infty, -\\epsilon]$.
    In general, the act of attaching a $k$-handle to a manifold $N$ is gluing a handle $\\cdisk{k} \\times \\cdisk{n-k}$ to the boundary of $N$ along its attachment region $S_k$ via a chosen embedding $S_k \\to  \\partial N$.
    We should remark that the resulting manifold is not always smooth, although there exist techniques to \`smooth the corners'..
    An overview is given in Figure~\\ref{fig:handle-diffeo-homeo-homotopy-equivalent}.
    We see that the cobordism $M$ with one critical point of index $k$ is diffeomorphic to $N$ with a \`smoothed $k-$handle' attached.
    This is homeomorphic to $N \\cup H$, which is the same as $N \\cup B^{k} \\times B^{n-k}$.
    Finally, this is homotopy equivalent to $N$ with a $k$-cell added (i.e.\\ $N \\cup B^{k}$).
    Proofs of these statements can be found in Morse Theory and Floer Homology by Audin and Damian\\sidenote[][-0.5cm]{\\fullcite[p.~32]{audin}}.

\\begin{figure*}[H]
    \\centering
    \\fullwidthincfig{handle-diffeo-homeo-homotopy-equivalent}
    \\sidecaption{Equivalences of handle structures.
    \\label{fig:handle-diffeo-homeo-homotopy-equivalent}}
\\end{figure*}

\\subsubsection*{Handle decomposition of closed manifolds}

Our goal now is to prove that any closed manifold $M$ admits a handle decomposition.
We will do this by splitting $M$ into cobordisms that only have a single critical point.
For this to work, we will need that the critical values are isolated, which is exactly what the following proposition states:

\\begin{prop}
    Let $f: M \\to  \\R$ be a Morse function on a closed manifold.
    Then there exists another function $g$ arbitrarily close to $f$ in $C^{1}$ sense that takes distinct values at all of its critical points.
    Moreover, if $X$ is a pseudo-gradient field adapted to  $f$,
    then we can choose $g$ such that $X$ is adapted to $g$ as well.
\\end{prop}
\\begin{myproof}
    We follow the proof of Audin and Damian\\sidecite[40]{audin}.
    Let $U = \\bigcup_{p \\in \\Crit f} U_p$ be the union of Morse neighbourhoods of critical points.
    Let $X$ be a pseudo-gradient field.
    Then by compactness, $df(X) < - \\epsilon_0$ outside $U$ for some $\\epsilon_0>0$.
    Let $h: M \\to  \\R$ be a function that is constant on each Morse chart such that $|dh(X)| < \\frac{1}{2}\\epsilon_0$ and
    \\[
        f(p) + h(p) \\neq f(q) + h(q),
    \\]
    where $p \\neq q$ are critical points.
    Then $f+h$ is still a Morse function, because it has exactly the same critical points as $f$.\\sidenote{
        If $p$ is a critical point of $f + h$, then  $df(X) + dh(X) = 0$ in  $p$.
        Outside of the Morse charts, $df(X) + dh(X) < 0$, so $p$ lies in a Morse chart. This implies that $df(X) + dh(X) = df(X) = 0$, so  $p$ is a critical point of $f$.
        Conversely, if $p$ is a critical point of  $f$, then because  $h$ is constant on Morse charts,  it is also a critical point of $f + h$.
    }
    Furthermore the critical points of $f + h$ are distinct and the vector field $X$ is still adapted.
\\end{myproof}

Now we are ready to prove one of the fundamental theorems in Morse theory.

\\begin{theorem}
    Any closed manifold has a handle decomposition.
\\end{theorem}
\\begin{myproof}
    We will later prove that that any closed manifold admits a Morse function $f: M \\to  \\R$.
    By the previous proposition, we may assume that the critical values of $f$ are distinct.
    Then we can split $M$ in cobordisms each having a single critical point.
    More explicitly, let $p_i$ be the critical points of  $f$ and  $a_i = f(p_i)$.
    As $a_i$ are distinct, we can choose regular values $b_i$ lying between $a_i$:
     \\[
    a_0 < b_0 < a_1 < \\cdots < a_n < b_n
    .\\]
    \\begin{marginfigure}[-3cm]
        \\centering
        \\incfig{any-closed-manifold-admits-a-handlebody-decomposition}
        \\caption{By splitting up a closed manifold in cobordisms with a single critical point, we find a handle decomposition.}
        \\label{fig:any-closed-manifold-admits-a-handlebody-decomposition}
    \\end{marginfigure}
    Then we split $M = \\bigcup M_i$ as follows:
     \\[
         M_0 = f^{-1}[a_0, b_0]\\qquad
         M_1 = f^{-1}[b_0, b_1]\\quad
         \\cdots
         \\quad
         M_{n-1} = f^{-1}[b_{n-1}, b_n]
    .\\]
    Each of these sets is a cobordism with exactly one critical value.
    As we have seen earlier, we can split each of these cobordisms in product structures and handles, giving rise to a handle decomposition of the total manifold $M$.
\\end{myproof}


\\subsection*{Handles in low dimensions}

Let us now discuss some examples of handle decompositions in low dimensions.
We will consider manifolds of dimension one, two and three and our examples will give rise to some interesting questions to which we will find an answer in the next chapter.
Let us start with one dimensional handles.


\\newcommand\\smallstrutt{\\rule[-0.5cm]{0pt}{1.1cm}}
\\subsubsection*{Handles in dimension one}
Handles in dimension one are the simplest ones.
We only have two types:

\\begin{description}
    \\item[\\minifig{1cm}{handle-1-0}] 0-handle $\\cdisk0 \\times \\cdisk{1} = [-1, 1]$, with attachment region $\\O$.
       
    \\item[\\minifig{1cm}{handle-1-1}] 1-handle   $\\cdisk{1} \\times  \\cdisk{0} = [-1, 1]$ with attachment region $S^{0} = \\{-1, 1\\}$.
\\end{description}
Combining these two handles, we can build any compact one dimensional manifold, one example being $S^{1}$.
Apart from the obvious way to do so, more involved handle decompositions also exist, as we show in the next example:

\\begin{eg}
    Below in Figure~\\ref{fig:one-dimensional-handle-decomposition-examples}, two handle decompositions of $S^{1}$ are illustrated.
    The first one is based on the height function $f$ when embedding $S^{1}$ in $\\R^2$.
    For the second decomposition, $g$ is again defined as a height function, but this time we embedded $S^{1}$ in $ \\R^2$ in a non-standard way.
    This results in two different handle decompositions of the same manifold.
\\end{eg}
\\begin{figure}[H]
    \\centering
    \\sidecaption{Two handle decompositions of $S^{1}$.
    \\label{fig:one-dimensional-handle-decomposition-examples}}
    \\incfig{one-dimensional-handle-decomposition-examples}
\\end{figure}
This example illustrates that handle decompositions are not unique.
We can however construct an isotopy from the second to the first embedding that cancels two critical points.
Interestingly, the height function is Morse for all $t$, except at the exact moment when the cancellation happens, indicated in yellow in below.
A local model for this is $t\\mapsto x^3 + tx$ as in Figure~\\ref{fig:non-examples-of-morse-functions}.
This raises then the question: when is it possible in general to find an isotopy that cancels two critical points? What are possible obstructions?
\\begin{figure*}[H]
    \\centering
    \\fullwidthincfig{isotopy-between-circle-and-other-circle}
    \\sidecaption{There exists an isotopy between the two handle decompositions described above.
    \\label{fig:isotopy-between-circle-and-other-circle}}
\\end{figure*}


\\subsubsection*{Handles in dimension two}
In dimension two, we have three types of handles:
\\begin{description}
    \\item[\\minifig{1cm}{handle-2-0}] 0-handle  $\\cdisk{0} \\times \\cdisk{2}$ with attachment region $\\O$.
    \\item[\\minifig{1cm}{handle-2-1}] 1-handle  $\\cdisk{1} \\times \\cdisk{1}$ with attachment region $\\cdisk1 \\times S^{0}$.
    \\item[\\minifig{1cm}{handle-2-2}] 2-handle  $\\cdisk{2} \\times \\cdisk{0}$ with attachment region $\\cdisk{0} \\times S^1$.
    \\end{description}
\\begin{marginfigure}
    \\centering
    \\incfig{handles-in-dimension-two-torus-decomposition}
    \\caption{The standard embedding of the torus in $\\R^3$ gives rise to a handle decomposition consisting of a 0-handle, two 1-handles and one 2-handle.}
    \\label{fig:handles-in-dimension-two-torus-decomposition}
\\end{marginfigure}
\\begin{eg}[Handle decomposition of the torus]
    Consider the height function on the torus embedded in $\\R^3$. This Morse function gives rise to the handle decomposition in Figure~\\ref{fig:handles-in-dimension-two-torus-decomposition}: a $0$-handle, two $1$-handles and one $2$-handle.
\\end{eg}

\\begin{eg}[The \`other sphere']
    In Figure~\\ref{fig:handles-in-dimension-two-other-sphere}, an embedding of $S^2$ in $\\R^3$ is given, and we again consider the height function.
    This function is Morse, and gives rise to a handle decomposition with a $0$-handle, a $1$-handle and two $2$-handles.
\\end{eg}
\\begin{marginfigure}
    \\centering
    \\incfig{handles-in-dimension-two-other-sphere}
    \\caption{Embedding $S^2$ in $ \\R^3$ in an unusual way gives rise to a handle decomposition with one 0-handle, one 1-handle and two 2-handles. }
    \\label{fig:handles-in-dimension-two-other-sphere}
\\end{marginfigure}
\\begin{marginfigure}
    \\centering
    \\incfig{handles-in-dimension-three-s1-x-s2}
    \\caption{Top: $ S^1 \\times S^{2}$ can be decomposed using a 0-handle, 1-handle, 2-handle and 3-handle.
        Bottom: same handle decomposition, but drawn differently to show that  a 0-handle and a 1-handle are diffeomorphic to $S^{2} \\times [0,1]$.
}
    \\label{fig:handles-in-dimension-three-s1-x-s2}
\\end{marginfigure}

\\subsubsection*{Handles in dimension three}
The last examples we will give will be three dimensional and quite a bit more interesting than the previous ones.
We have four types of handles:


\\begin{description}
    \\item[\\minifig{1cm}{handle-3-0}]  0-handle  $ \\cdisk0 \\times \\cdisk{3}$ with attachment region $\\O$
    \\item[\\minifig{1cm}{handle-3-1}] 1-handle  $ \\cdisk1 \\times \\cdisk{2}$ with attachment region $ S^{0} \\times \\cdisk 2$
    \\item[\\minifig{1cm}{handle-3-2}] 2-handle  $ \\cdisk2 \\times \\cdisk{1}$ with attachment region $ S^{1} \\times \\cdisk1$
    \\item[\\minifig{1cm}{handle-3-3}] 3-handle  $ \\cdisk3 \\times \\cdisk{0}$ with attachment region $S^{2} \\times B^{0}$
\\end{description}

Drawing three-dimensional handle decompositions is sometimes difficult. Most of the times we suppress the $0$-handle and also the $3$-handle is not drawn. If a $3$-handle is to be attached, to \`cap it off', we usually write \`\`$\\cup $ $3$-handle''.
The first three examples will be (products of) spheres, i.e.\\ $S^{3}$, $S^{1} \\times S^{2}$ and $S^{1} \\times S^{1} \\times S^{1}$.
\\begin{eg}[Handle decomposition of $S^{3}$]
    Consider $S^{3} \\subset \\R^{4}$ and the height function $f$, the projection on the last coordinate.
    Then $f$ has two critical points: $(0, 0, 0, \\pm 1)$ of index $0$ and $3$.
    The handle decomposition is then a $0$-handle glued to a $3$-handle, which is in this case two balls $B^{3}$ glued along their boundary.
\\end{eg}

\\begin{eg}[Handle decomposition of $ S^1\\times S^{2}$]
    An example of a handle decomposition of $S^{1} \\times S^{2}$ is illustrated in Figure~\\ref{fig:handles-in-dimension-three-s1-x-s2}.
    The construction starts with a $0$-handle, which is just a three dimensional ball.
    Then we glue on a $2$-handle.
    The resulting manifold is then a thickened up two sphere, $\\cdisk 1 \\times S^{2}$.
    Then we add a $1$-handle connecting the inside to the outside and we cap off with a $3$-handle, which has the effect of identifying the end points of $\\cdisk 1$, i.e.\\ this transforms  $\\cdisk 1 \\times S^{2}$ into $ S^1 \\times S^{2}$.
\\end{eg}

\\begin{eg}[$T^{3} = S^{1} \\times S^{1} \\times S^{1}$]
    \\label{eg:handle-decomposition-three-torus}
    To find a handle decomposition of $T^3$, we identify $T^{3}$ with $\\R^3 / \\Z^{3}$ and consider the following map
    \\begin{align*}
        f: T^{3} &\\longrightarrow \\R \\\\
        (x, y, z) &\\longmapsto 2\\cos (2 \\pi x) + 3\\cos ( 2 \\pi y) + 4 \\cos(2 \\pi z)
    .\\end{align*}
    Then we have
    \\[
        df =
        -4\\pi \\sin (2 \\pi x) dx
        -6 \\pi \\sin ( 2 \\pi y) dy
        - 8 \\pi \\sin(2 \\pi z) dz
    ,\\]
    so critical points are all $(x, y, z) \\in \\R^3 / \\Z^3$ for which  $x, y, z \\in \\left\\{0, \\frac{1}{2} \\right\\}$.
    In total we have $8$ distinct critical points and they are all non-degenerate, because the Hessian of $f$, given by
    \\[
        H_{(x, y, z)} f =
        - 8 \\pi^2  \\cos (2 \\pi x) dx^2
        -12\\pi^2 \\cos ( 2 \\pi y) dy^2
        -16 \\pi^2 \\cos(2 \\pi z) dz^2
    \\]
    is non-degenerate at each of the critical points.
    To find the handle decomposition induced by $f$, we have to determine the index of the critical points.
    As discussed earlier, the index is the number of downward directions, which is also equivalent to the number of negative eigenvalues of $H_{(x, y, z)}f$.
    We find that the index of a critical point $(x, y, z)$ is the number of zeros occurring in the triplet $(x, y, z)$. Hence we get the following table:
    \\[\\begin{array}{cccccc}
  & x & y  & z & f(x, y, z) & \\text{Index}\\\\ \\hline
  & 0 & 0 & 0 & 9 & 3 \\\\
& \\frac{1}{2} & 0 & 0 & 5 & 2 \\\\
& 0 & \\frac{1}{2} & 0 & 3 & 2 \\\\
& 0 & 0 & \\frac{1}{2} & 1 & 2 \\\\
& \\frac{1}{2} & \\frac{1}{2} & 0 & -1 & 1 \\\\
& \\frac{1}{2} & 0 & \\frac{1}{2} & -3 & 1 \\\\
& 0 & \\frac{1}{2} & \\frac{1}{2} & -5 & 1 \\\\
& \\frac{1}{2} & \\frac{1}{2} & \\frac{1}{2} & -9 & 0 \\\\
    \\end{array}\\]
    We conclude that we can decompose $T^3$ in one $0$-handle, three $1$-handles, three $2$-handles and one $3$-handle. We have illustrated the construction below.
    % A natural question that arises is: \`Can we build $T^{3}$ using less handles'?

    \\begin{figure*}[H]
    \\centering
    \\includegraphics[width=0.90\\paperwidth]{./notebooks/three-torus/output.png}
    \\sidecaption{
        Step by step construction of $T^{3}$ adding one handle at the time.
        Here, $T^{3} = \\R^3/ \\Z^3$, and $\\left[-\\frac{1}{2}, \\frac{1}{2}\\right]^3$ is drawn.\\\\
        The construction starts with a $0$-handle.
        In the first three steps, each time a $1$-handle is added.
        In the consequent steps,
        three holes are filled with $2$-handles,
        leaving us with a single void we fill up with a $3$-handle.
        \\label{fig:three-torus-handle-decomposition}
    }
\\end{figure*}
While this choice of Morse function may seem unmotivated, it is actually based on an example we saw before, namely $S^{1}$ with its height function.
Indeed, if we identify $S^{1} = \\R / \\Z$, then $g_r(x) = r\\cos(2 \\pi x)$ is exactly the height function of a sphere of radius $r$.
Taking the product of $S^{1}$ three times and adding their corresponding Morse functions (with carefully chosen coefficients in order to have distinct critical values), we end up with the given example: $S^{1}\\times S^{1} \\times S^{1}$ and $f = g_2(x) + g_3(y) + g_4(z)$.
This method of constructing a Morse function on the product is something that works in general and we will be considering this in more detail later on.

% \\vspace*{-10ex}
\\end{eg}

\\begin{eg}
    \\label{eg:cancel-three}
    As a last example, we have illustrated a $3$-manifold with boundary in Figure~\\ref{fig:example-cancelling-handles-in-three-dimensions}.
    It consists of a $0$-handle, a $1$-handle and a $2$-handle.
    Here, the $2$-handle is placed on top of the $1$-handle.
    It is also easy to see that the $1$- and $2$-handle can be cancelled by an isotopy.

    This is an example where the order of the handles is important: we cannot attach the $2$-handle before the $1$-handle.
    This is not always the case: in the example discussing the handle decomposition of $ S^1 \\times S^2$, we see that the $1$- and  $2$-handle are independent.
    This raises the question: \`Under what conditions can we reorder the attachment of handles?' We will answer this question in the next chapter.

    \\begin{marginfigure}
    \\centering
    \\incfig{example-cancelling-handles-in-three-dimensions}
    \\caption{An example of a $3$-manifold where a $1$- and $2$-handle can be cancelled.}
    \\label{fig:example-cancelling-handles-in-three-dimensions}
\\end{marginfigure}
\\end{eg}





\\section{Existence and abundance of Morse functions}
We end this chapter with a more technical result.
In this section we show that any manifold admits uncountably many Morse functions and that the set of Morse functions form a dense subset of all smooth functions $M \\to  \\R$.
In other words, almost any function is a Morse function and we can approximate any function by a Morse function.

Let us first recall the following result, due to Whitney.
\\begin{theorem}[Whitney Embedding Theorem]
    Any smooth manifold $M$ of dimension $m$ can be embedded into  $\\R^{2m+1}$.
\\end{theorem}
This allows us to assume that $M$ is a submanifold of $\\R^{n}$, making the constructions  more straightforward.
The following theorem says that there is an abundance of Morse functions on any manifold.
\\begin{prop}
    Let $M \\subset \\R^{n}$ be a submanifold.
    Then for almost every point $p \\in \\R^{n}$, we have that
    \\[
    f_p : M \\to \\R: x \\mapsto  \\|x - p\\|^2
    \\]
    is a Morse function.
\\end{prop}
\\begin{marginfigure}[-4cm]
    \\centering
    \\incfig{level-sets-of-distance-function-torus}
    \\caption{An embedding of the torus $T^2$ in $\\R^3$. The level sets of $f_p$ are spheres. We see that $f_p$ has four critical points: a maximum, a minimum and two saddle points.}
    \\label{fig:level-sets-of-distance-function-torus}
\\end{marginfigure}
\\begin{eg}
    Consider Figure~\\ref{fig:level-sets-of-distance-function-torus}, where we have embedded the torus $T^{2} \\hookrightarrow \\R^3$ and have drawn some level sets of $f_p$.
    If should be intuitively clear that  $f_p$ is a Morse function.
\\end{eg}
Let us also give an example when $f_p$ is not a Morse function:
\\begin{noneg}
    Let $M = S^1 = \\{\\|x\\|^2 = 1  \\mid  x \\in \\R^2\\} $.
    Then the map $f_{(0, 0)}:(x_1,x_2)\\mapsto x_1^2 + x_2^2$ is not a Morse function.
    Indeed, $f_{(0, 0)} \\equiv 1$, so in particular the second derivative is degenerate (it vanishes everywhere).
\\end{noneg}


More generally, $f_p$ is not a Morse function when infinitesimally close normals intersect in $p$, because then the distance (squared) to that point $f_p$ is constant up to second order.
Such points $p$ are called focal points.
To make this precise, we will show that $H_p$ is non-degenerate if $p$ is a critical value of the map
\\[
    E: NM \\to  \\R^{n}: (x, v) \\mapsto x + v
,\\]
where $NM$ is the normal bundle of $M$.
Then Sard's theorem will immediately imply that $f_p$ is Morse for almost all $p$.

\\begin{figure}[H]
    \\centering
    \\sidecaption{
        Visualization of the normal bundle of $M$, a submanifold of $\\R^n$, and the map $E$ used in the proof.
    }
    \\incfig{existence-of-morse-functions-normal-bundle-map}
    \\label{fig:existence-of-morse-functions-normal-bundle-map}
\\end{figure}

\\begin{myproof}
    With this idea, the proof reduces to a straightforward although tedious calculation.
    First note that $x$ is a critical point of $f_p$ only if $x-p \\perp T_x M$.
    Indeed:
    \\[
        d f_p = \\sum_{i=1}^{n} d(x_i - p_i)^2 = 2 \\sum_{i=1}^{n} (x_i-p_i) dx_i = 0 \\qquad \\text{if $x-p \\perp T_x M$}
    .\\]
    Let $d = \\dim M$ and $(u_1, \\ldots, u_d) \\mapsto x(u_1, \\ldots, u_d)$ be a local parametrization of $M$.
    Then we have
    \\[
        \\partial_i f_p = 2(x-p) \\cdot  \\partial_i  x
    \\]
    and for the Hessian we have
    \\[
    H_p = \\partial_{ij} f_p = 2 \\left(\\partial_j x \\cdot \\partial_i x  + (x-p) \\partial_{ij} x \\right)
    ,\\]
    where we denoted $\\partial_i = \\frac{\\partial }{\\partial u_i}$.
    We will show that $H_p$ is not of full rank if and only if $p$ is a critical value of  
    \\[
        E: NM \\to  \\R^n: (x, v) \\mapsto x + v
    ,\\]
    where $NM$ is the normal bundle to $M$ w.r.t.\\ the Euclidean metric on $\\R^n$.

    First we define a local parametrization of $NM$:
    \\[
        (u_1, \\ldots, u_d, t_1, \\ldots, t_{n-d}) \\mapsto \\Big(x(u_1, \\ldots, u_d), \\sum_{i=1}^{n-d} t_i v_i(u_1, \\ldots, u_{d})\\Big)
    ,\\]
    where the $v_i$ form a local orthonormal basis at each point, normal to $TM$.
\\begin{marginfigure}
    \\centering
    \\incfig{abundance-of-morse-functions-parametrization-of-the-normal-bundle}
    \\caption{Parametrization of the normal bundle of $M$.}
    \\label{fig:abundance-of-morse-functions-parametrization-of-the-normal-bundle}
\\end{marginfigure}
    Then in these coordinates,
    \\[
        \\partial_i E = \\partial_i x  + \\sum_{k=1}^{n-d} t_k \\partial_i v_k
        \\qquad
        \\qquad
        \\partial_{t_j} E  = v_j
    .\\]
    To see whether these vectors are independent, we compute the inner products with the $n$ independent vectors $\\partial_1 x , \\ldots, \\partial_d x , v_1, \\ldots, v_{n-d}$.
    This gives the following matrix with the same rank as $E_*$:
     \\[
    \\begin{pmatrix}
        (\\partial_i x\\cdot \\partial_j x + \\sum_k t_k \\partial_iv_{k} \\cdot \\partial_j x) &  \\sum_{k=1}^{n-d} \\partial_i v_{k} \\cdot  v_\\ell\\\\
        0 & \\operatorname{Id}
    \\end{pmatrix}
    .\\]
    Therefore $E_*$ is of full rank iff the matrix with entries
    \\[
        A_{i, j} = \\partial_i x\\cdot \\partial_j x + \\sum_{k=1}^{n-d} t_k \\partial_iv_{k} \\cdot \\partial_j x \\]  is of full rank.
    Now in the second term, we can move $\\partial_i$ from $v_k$ to $x$ and get a minus sign in return:
    \\begin{align*}
        \\partial_iv_{k} \\cdot \\partial_j x &= \\partial_i (v_k \\cdot \\partial_j x)  - v_k \\cdot  \\partial_i \\partial_j x\\\\
                               &= - v_k \\cdot  \\partial_i \\partial_j x
    ,\\end{align*}
    as $v_k \\perp \\partial_j x$.
    This allows us to rewrite the matri
    \\begin{align*}
        A_{ij} &=  \\partial_i x\\cdot \\partial_j x - \\sum_{k=1}^{n-d} t_k v_{k} \\cdot \\partial_i \\partial_j x  \\\\
        &= \\partial_i x\\cdot \\partial_j x - v \\cdot \\partial_i \\partial_j x  \\\\
        &= \\partial_i x\\cdot \\partial_j x + (x-p) \\cdot \\partial_i \\partial_j x  \\\\
        &= (H_p)_{ij}
    .\\end{align*}
    Therefore, $E_*$ is of full rank iff $H_p$ is of full rank.
    This concludes the proof.
\\end{myproof}

Apart from the abundance of Morse functions, we also have that any smooth function can be approximated by a Morse function. By this we mean the following:
\\begin{prop}
    Let $f: M \\to  \\R$ be a function.
    Let $k$ be an integer.
    Then $f$ and all its derivatives of order $\\le k$ can be uniformly
    approximated by Morse functions on every compact subset.
\\end{prop}

The idea of the proof goes as follows.
We choose an embedding of $M$ where $f$ is the first coordinate on $M$, so we can think of $f$ as a simple projection: $x \\mapsto x_1$.\\sidenotemark\\ Then this function can be approximated in the following way:
\\[
    x_1 \\approx \\frac{(x_1+c)^2 - c^2}{2c} \\qquad \\text{as $c \\to  \\infty$,}
\\]
and even when taking extra dimensions into account, the approximation still works:
\\[
    x_1 \\approx \\frac{\\|x - p\\|^2 - c^2}{2c} \\qquad \\text{with $p = (-c, 0, \\ldots, 0)$ and $c\\to  \\infty$}
.\\]
\\sidenotetext[][-5cm]{
    Start with an embedding $\\phi: M \\hookrightarrow \\R^{n}$ for large enough $n$.
    Then consider  $\\psi: M \\to  \\R^{n+1}: x\\mapsto (f(x), \\Phi(x))$.
    Then the height function of this embedding is exactly $f$.
}
Now, note that the right hand side is almost always a Morse function.  Hence, we can the proposition as follows.

\\begin{myproof}
    Using the Whitney embedding theorem, embed $M$ in $\\R^{n}$ for $n$ sufficiently large such that $f$ is the first coordinate:
    \\[
        h(x) = (f(x), h_2(x), \\ldots, h_n(x))
    .\\]
    Let $c \\in \\R$. For almost every point $p = (-c + \\epsilon_1, \\epsilon_2, \\ldots, \\epsilon_n)$, the function
    \\[
        g_c(x) = \\frac{\\|x - p\\|^2 - c^2}{2c}
    \\]
    is Morse.
    Then
    \\begin{align*}
        g_c(x) &= \\frac{1}{2c}  \\sum_{i=1}^{n} (x_i - p_i)^2 - c^2\\\\
             &= \\frac{1}{2c} \\left((f(x) + c - \\epsilon_1 )^2 + (h_2(x) - \\epsilon_2)^2 + \\cdots + (h_n(x) - \\epsilon_n)^2\\right)\\\\
             &= f(x) +  \\frac{f(x)^2 + \\sum h_i(x)^2}{2c} - \\frac{\\epsilon_1 f(x)  + \\sum \\epsilon_i h_i(x)}{c}  + \\sum_{i=1}^{n} \\epsilon_i^2 - \\epsilon_1
    .\\end{align*}

    This concludes the proof.
    Indeed, let $K$ be a compact subset of $M$.
    The functions $\\frac{d^{j}}{dx^{j}} (f(x)^2 + \\sum h_i(x)^2)$ for $j = 1, \\ldots,k$ all attain their maximum on $K$, so by choosing $c$ big enough, we can make them simultaneously arbitrarily small in a uniform way. Similarly for the third term.
    Lastly, we can also make $\\epsilon_i$ arbitrarily small while still retaining that $g$ is a Morse function.
\\end{myproof}

\\begin{figure}
    \\centering
    \\sidecaption{
        We can approximate any smooth function with a Morse function.
        On the left, we plotted the level sets of $f$ itself.
        Because the coordinates are $f$ and $h_2$, these level sets are vertical planes.
        The two right plots show level sets of $g_c$ for $c=10$ and $c=100$, which are circles.
        We see that $g_c$ approximates $f$ if $c \\to  \\infty$.
    }
    \\incfig{approximate-morse-functions}
    \\label{fig:approximate-morse-functions}
\\end{figure}

     </example>

</examples>

<user-prompt>

follow all instructions and take inspiration from the example, but remember that it isn't the end-all-be-all layout. It's just an instance of good format and aesthetics. Return the latex code in a single codeblock
Please output only a valid JSON object that conforms to the following schema:
  {
    "latex": "string"
  }
  Do not include any additional commentary or text.
</user-prompt>


`,w=document.getElementById("fileInput"),b=document.getElementById("sendToGemini"),_=document.getElementById("apiKey"),$=document.getElementById("latexOutput"),x=document.getElementById("compileLatex");let h=null;w.addEventListener("change",n=>{const t=n.target.files[0];t&&(h=t)});b.addEventListener("click",async()=>{if(!h){alert("Please select a file first.");return}const n=_.value.trim();if(!n){alert("Please enter your API key.");return}try{const t=await p(n,h),a=await u(n,t,g);$.value=a}catch(t){console.error("Error during processing:",t),alert("An error occurred. Please try again.")}});function y(n){return btoa(unescape(encodeURIComponent(n)))}x.addEventListener("click",()=>{const n=$.value;if(!n.trim()){alert("LaTeX output is empty.");return}const a="data:application/x-tex;base64,"+y(n),o="https://www.overleaf.com/docs?snip_uri="+encodeURIComponent(a);window.open(o,"_blank")});
