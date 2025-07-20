export const deterministicRandom = (x, z) => {
    const med_prime = 2038074743;
    let hash = Math.floor(x) * 15485863 + Math.floor(z) * med_prime;
    hash = Math.sin(hash) * 10000;
    return hash - Math.floor(hash);
};

