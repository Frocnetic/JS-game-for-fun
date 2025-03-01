function InterpolationBetweenPoints(landSize, initialHeight, up, down, variabilityCap, pointGaps) {
    // INPUT
    //    landSize = størrelsen af det land, der skal genereres
    //    initialHeight = den oprindelige højde af landet
    //    up = den maksimale opadgående variabilitet i højde
    //    down = den maksimale nedadgående variabilitet i højde
    //    variabilityCap = grænsen for højdevariabilitet
    //    pointGaps = antallet af pixels mellem hovedpunkter
    // OUTPUT
    //    De genererede landhøjder

    let majorPoints = generateHeights((landSize / pointGaps) + 1, initialHeight, up, down, variabilityCap);
    let heights = [];

    for (let point = 0; point < majorPoints.length - 1; point++) {
        let left = majorPoints[point];
        let right = majorPoints[point + 1];
        let step = (right - left) / pointGaps;

        for (let index = 0; index <= pointGaps; index++) {
            heights[(point * pointGaps) + index] = left + (step * index);
        }
    }

    return heights;
}

function generateHeights(numPoints, initialHeight, up, down, variabilityCap) {
    // Genererer højder for hovedpunkter
    let heights = [initialHeight];
    for (let i = 1; i < numPoints; i++) {
        let lastHeight = heights[i - 1];
        let change = (Math.random() * (up + down)) - down;
        change = Math.max(-variabilityCap, Math.min(variabilityCap, change));
        heights.push(lastHeight + change);
    }
    return heights;
}

// Eksporterer funktionen til brug i andre filer
export { InterpolationBetweenPoints };